import { cookies } from "next/headers";

const jwt = require('jsonwebtoken');

const JWT_NAME = "access_jwt";

// define Token type
export type Token = {
    token_type: string;
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
    scope: string;
}

function getAESKey() {
    //const secret = process.env.JWT_SECRET;
    // TODO: use a real secret
    return crypto.subtle.importKey(
        "raw",
        Buffer.from("2b7e151628aed2a6abf7158809cf4f3c", "base64"),
        "AES-CBC",
        true,
        ["encrypt", "decrypt"],
    );

}

function getSigningSecret() {
    //const secret = process.env.JWT_SECRET;
    // TODO: use a real secret
    const secret = new TextEncoder().encode(
        '7113be43057f47849a43e27dbf96299843e8800d4861adb7a7779b84d30f6954',
    );

    return secret;
}

async function encryptToken(token: string, aesKey: CryptoKey, iv: Uint8Array) {


    const alg = "AES-CBC"

    const te = new TextEncoder();
    const encodedToken = te.encode(token).buffer;

    const encryptedToken = await crypto.subtle.encrypt(
        {
            name: alg,
            iv: iv,
        },
        aesKey,
        encodedToken,
    );

    const tokenAsStr = Buffer.from(encryptedToken).toString("base64");

    return tokenAsStr;

}

async function decryptToken(tokenAsStr: string, aesKey: CryptoKey, iv: Uint8Array) {
    
    const alg = "AES-CBC";

    const encryptedToken = Buffer.from(tokenAsStr, "base64");

    const encodedToken = await crypto.subtle.decrypt(
        {
            name: alg,
            iv: iv,
        },
        aesKey,
        encryptedToken,
    );

    const te = new TextDecoder();
    const token = te.decode(encodedToken);

    return token;
}

export async function tokenToJwt(authToken: Token) {

    const aesKey = await getAESKey();
    const iv = crypto.getRandomValues(new Uint8Array(16));

    const encAccessToken = await encryptToken(authToken.access_token, aesKey, iv);
    const encRefreshToken = await encryptToken(authToken.refresh_token, aesKey, iv);

    const payload = {
        "iat": authToken.expires_at,
        "acc": encAccessToken,
        "ref": encRefreshToken,
        "iv": Buffer.from(iv).toString("base64"),
    }

    const secret = getSigningSecret();

    const token = jwt.sign(payload, secret, {
        algorithm: "HS256",
        expiresIn: authToken.expires_in
    });

    return {
        jwt: token,
        expires: authToken.expires_at,
    }

}

export async function getAccessTokenFromJwt(token: string) {

    const secret = getSigningSecret();

    const payload = jwt.verify(token, secret, {
        algorithms: ["HS256"],
    });

    const aesKey = await getAESKey();
    const iv = Buffer.from(payload.iv, "base64");

    const accessToken = await decryptToken(payload.acc, aesKey, iv);

    return accessToken;

}

export async function getRefreshTokenFromJwt(token: string) {

    const secret = getSigningSecret();

    const payload = jwt.verify(token, secret, {
        algorithms: ["HS256"],
    });

    const aesKey = await getAESKey();
    const iv = Buffer.from(payload.iv, "base64");
    
    const refreshToken = await decryptToken(payload.ref, aesKey, iv);

    return refreshToken;

}

export async function storeJwt(jwt: string, expires: number) {

    cookies().set(JWT_NAME, jwt, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        expires: new Date(expires * 1000),
    });
}
