import { permanentRedirect } from "next/navigation";
import { NextRequest } from "next/server";
import { AuthToken } from "@/lib/auth/token";
import { SpotifyAuthResponse, fetchAuthToken } from "@/lib/auth/spotify";

export async function GET(request: NextRequest) {

    // TODO: raise error if code or token is not present
    const code: string | null = request.nextUrl.searchParams.get("code");
    if (code === null) permanentRedirect("/callback-error1");

    const res: SpotifyAuthResponse | undefined = await fetchAuthToken(code);
    if (res === undefined) permanentRedirect("/callback-error2");

    const token: AuthToken = await AuthToken.fromSpotifyResponse(res);

    await token.store();

    permanentRedirect("/");

}
