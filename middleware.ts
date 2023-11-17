import { AuthToken } from "@/lib/auth/token";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {

    var authToken: AuthToken | undefined = await AuthToken.fromCookie();

    // if authToken is undefined and the request is not to the login page or homepage, redirect to homepage
    if (authToken === undefined) {
        if (!request.nextUrl.pathname.startsWith("/login") && !request.nextUrl.pathname.startsWith("/")) {
            return NextResponse.redirect(new URL('/', request.url));
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
