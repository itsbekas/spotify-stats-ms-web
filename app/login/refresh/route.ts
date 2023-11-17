import { permanentRedirect } from "next/navigation";
import { NextRequest } from "next/server";
import { AuthToken } from "@/lib/auth/token";
import { SpotifyAuthResponse, fetchRefreshToken } from "@/lib/auth/spotify";

export async function GET(request: NextRequest) {

    const currToken: AuthToken | undefined = await AuthToken.fromCookie();
    if (currToken === undefined) return permanentRedirect("/refresh-error1");

    const refreshToken = await currToken.getRefreshToken();

    const res: SpotifyAuthResponse | undefined = await fetchRefreshToken(refreshToken);
    if (res === undefined) return permanentRedirect("/refresh-error-2");

    const newToken: AuthToken = await AuthToken.fromSpotifyResponse(res);

    await newToken.store();

    // Avoid infinite redirect loop
    if (request.nextUrl.pathname === "/login/refresh") {
        return permanentRedirect("/");
    }

    return permanentRedirect(request.nextUrl.pathname);

}
