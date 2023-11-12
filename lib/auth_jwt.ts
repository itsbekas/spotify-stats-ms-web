import * as jose from "jose";
import { cookies } from "next/headers";

// define Token type
export type Token = {
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
    scope: string;
}

export async function tokenToJWT(token: Token) {
    
    // TODO: use a real secret
    const secret = new TextEncoder().encode(
        'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
    );

    const jwt = await new jose.EncryptJWT()
        .setProtectedHeader({ alg: 'dir', enc: 'A256CBC-HS512' })
        .setIssuedAt()
        .setExpirationTime(token.expires_at)
        .setSubject("teste")
        .encrypt(secret);

    return {
        jwt: jwt,
        maxAge: token.expires_at,
    }

}

export async function storeJWT(jwt: string, maxAge: number) {

    cookies().set("access_jwt", jwt, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        expires: new Date(maxAge * 1000),
    });

}
