import { fetchAPI } from "@/lib/api";
import { permanentRedirect } from "next/navigation";
import { NextRequest } from "next/server";
import { Token, tokenToJWT, storeJWT } from "@/lib/auth_jwt";

async function fetchAuthToken(code: string) {
    const params = {
        code: code
    }
    const res = await fetchAPI("/login/callback", params);
    if (!res.ok) return undefined;
    const token = res.json() as Promise<Token>;
    return token;
}

export async function GET(request: NextRequest) {
    
    // TODO: raise error if code or token is not present
    const code: string | null = request.nextUrl.searchParams.get("code");
    if (code === null) return permanentRedirect("/");
    
    const token: Token | undefined = await fetchAuthToken(code);
    if (token === undefined) return permanentRedirect("/");

    const { jwt, maxAge }: { jwt: string; maxAge: number } = await tokenToJWT(token);

    storeJWT(jwt, maxAge);

    return permanentRedirect("/");
    
}