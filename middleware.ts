import { AuthToken } from "@/lib/auth/token";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

    var authToken: AuthToken | undefined = await AuthToken.fromCookie();

    // if authToken is undefined and the request is not to the login page, redirect to login
    if (authToken === undefined) {
        if (!request.nextUrl.pathname.startsWith("/login")) {
            return NextResponse.redirect(new URL('/login', request.url));
        } else {
            return NextResponse.next();
        }
    }

    if (authToken.isExpired()) {
        if (!request.nextUrl.pathname.startsWith("/login")) {
            return NextResponse.rewrite(new URL('/login/refresh', request.url));
        } else {
            return NextResponse.next();
        }
    }

}
