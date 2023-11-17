import { NextRequest } from "next/server";
import { AuthToken } from "@/lib/auth/token";
import { permanentRedirect } from "next/navigation";

export async function GET(request: NextRequest) {

    AuthToken.deleteCookie();

    return permanentRedirect("/");

}
