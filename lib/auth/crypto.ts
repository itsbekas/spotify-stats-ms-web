export async function getAESKey(): Promise<CryptoKey> {
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

export function getSigningSecret(): Uint8Array {
    //const secret = process.env.JWT_SECRET;
    // TODO: use a real secret
    const secret = new TextEncoder().encode(
        '7113be43057f47849a43e27dbf96299843e8800d4861adb7a7779b84d30f6954',
    );

    return secret;
}

export async function encryptToken(token: string, aesKey: CryptoKey, iv: Uint8Array): Promise<string> {


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

export async function decryptToken(tokenAsStr: string, aesKey: CryptoKey, iv: Uint8Array): Promise<string> {
    
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
