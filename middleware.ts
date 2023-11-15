import { AuthToken } from "@/lib/auth/token";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

    console.log("running middleware")

    var authToken: AuthToken | undefined = await AuthToken.fromCookie();

    // if authToken is undefined and the request is not to the login page, redirect to login
    if (authToken === undefined) {
        if (!request.nextUrl.pathname.startsWith("/login")) {
            return NextResponse.redirect("/login");
        } else {
            return;
        }
    }

    if (authToken.isExpired()) {
        console.log("refreshing")
        await authToken.refresh(); // Doesn't modify authToken, stores new token in cookie
    }

}