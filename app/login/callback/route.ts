import { fetchAPI } from "@/lib/api";
import * as jose from "jose";
import { permanentRedirect } from "next/navigation";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

// define Token type
type Token = {
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
    scope: string;
}

async function retrieveToken(code: string) {
    const params = {
        code: code
    }
    const res = await fetchAPI("/login/callback", params);
    if (!res.ok) return undefined;
    const token = res.json() as Promise<Token>;
    return token;
}

async function tokenToJWT(code: string) {
    const token: Token | undefined = await retrieveToken(code);

    if (token === undefined) {
        // TODO: handle error
        permanentRedirect("/login");
    }
    
    // TODO: use a real secret
    const secret = new TextEncoder().encode(
        'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
    );

    const alg = "HS256";

    const jwt = await new jose.SignJWT()
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime(token.expires_at)
        .setSubject(`${token.access_token} ${token.refresh_token}`)
        .sign(secret);

    return {
        jwt: jwt,
        maxAge: token.expires_at,
    }

}

export async function GET(request: NextRequest) {
    
    const code: string | null = request.nextUrl.searchParams.get("code");

    if (code === null) {
        // TODO: handle error
        permanentRedirect("/login");
    }

    const { jwt, maxAge }: { jwt: string; maxAge: number } = await tokenToJWT(code);

    cookies().set("access_jwt", jwt, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        expires: new Date(maxAge * 1000),
    });

    return permanentRedirect("/");
    
}