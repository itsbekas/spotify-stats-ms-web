import { cookies } from "next/headers";
import { getAESKey, getSigningSecret, encryptToken, decryptToken } from "./crypto";
import { SpotifyAuthResponse } from "./spotify";

import * as jose from "jose";

export const JWT_NAME = "access_jwt";

export class AuthToken {
    // Tokens are stored encrypted
    accessToken: string;
    refreshToken: string;
    iv: string;
    expiresAt: number;
    scope: string;

    constructor(
        accessToken: string,
        refreshToken: string,
        iv: string,
        expiresAt: number,
        scope: string,
    ) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.iv = iv;
        this.expiresAt = expiresAt;
        this.scope = scope;
    }

    static async fromSpotifyResponse(res: SpotifyAuthResponse): Promise<AuthToken> {

        const aesKey = await getAESKey();
        const iv = crypto.getRandomValues(new Uint8Array(16));

        const encAccessToken = await encryptToken(res.access_token, aesKey, iv);
        const encRefreshToken = await encryptToken(res.refresh_token, aesKey, iv);

        const token = new AuthToken(
            encAccessToken,
            encRefreshToken,
            iv.toString(),
            res.expires_at,
            res.scope,
        );

        return token;
    }

    static async fromCookie(): Promise<AuthToken | undefined> {
            
        let cookie = cookies().get(JWT_NAME);

        if (cookie === undefined) return undefined;

        const secret = getSigningSecret();

        type Payload = {
            acc: string,
            ref: string,
            scp: string,
            iv: string,
            exp: number,
        }

        const jwt = await jose.jwtVerify(cookie.value, secret);

        const payload: Payload = jwt.payload as Payload;

        const token = new AuthToken(
            payload.acc,
            payload.ref,
            payload.iv,
            payload.exp,
            payload.scp,
        );

        return token;

    }

    private async toJwt(): Promise<string> {
        
        const payload = {
            "acc": this.accessToken,
            "ref": this.refreshToken,
            "scp": this.scope,
            "iv": this.iv,
            "exp": this.expiresAt,
        }

        const secret = getSigningSecret();

        const token = await new jose.SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("90d")
            .sign(secret);

        return token;

    }

    async store() {
        const token = await this.toJwt();
        // Cookie expires 3 months after auth token
        const expires = new Date(this.expiresAt * 1000 + 1000 * 60 * 60 * 24 * 30 * 3);

        cookies().set(JWT_NAME, token, {
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            expires: expires,
        });
    }

    async getAccessToken(): Promise<string> {
        const aesKey = await getAESKey();
        const iv = Uint8Array.from(this.iv.split(',').map(x=>parseInt(x,10)));
        const accessToken = await decryptToken(this.accessToken, aesKey, iv);
        return accessToken;
    }

    async getRefreshToken(): Promise<string> {
        const aesKey = await getAESKey();
        const iv = Uint8Array.from(this.iv.split(',').map(x=>parseInt(x,10)));
        const refreshToken = await decryptToken(this.refreshToken, aesKey, iv);
        return refreshToken;
    }

    isExpired(): boolean {
        // is expired if issued over 1 hour ago
        return Date.now() / 1000 - this.expiresAt > 60 * 60;
    }

}
