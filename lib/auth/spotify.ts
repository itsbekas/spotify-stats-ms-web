import { fetchAPI } from "@/lib/api";

export type SpotifyAuthResponse = {
    access_token: string,
    token_type: string,
    scope: string,
    expires_in: number,
    expires_at: number,
    refresh_token: string
}

export async function fetchAuthURL(): Promise<string | undefined> {
    const res = await fetchAPI("/login");
    if (!res.ok) return undefined;
    const loginURL = await res.json();
    return loginURL;
}

export async function fetchAuthToken(code: string): Promise<SpotifyAuthResponse | undefined> {
    const params = {
        code: code
    }
    const res = await fetchAPI("/login/callback", params);
    if (!res.ok) return undefined;
    const token = res.json() as Promise<SpotifyAuthResponse>;
    return token;
}

export async function fetchRefreshToken(refreshToken: string): Promise<SpotifyAuthResponse | undefined> {
    const params = {
        refresh_token: refreshToken
    }
    const res = await fetchAPI("/login/refresh", params);
    if (!res.ok) return undefined;
    const token = res.json() as Promise<SpotifyAuthResponse>;
    return token;
}