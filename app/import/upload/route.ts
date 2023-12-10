import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { post } from "@/lib/api";

export async function POST(request: NextRequest) {

    // validate json
    const data = await request.json();
    
    const res = await post("/import", data);

    
    if (!res.ok) {
        // TODO: handle error
    }

    // TODO: request.url (there's confusion between 127.0.0.1 and localhost)
    // return NextResponse.redirect(new URL('/import/success', request.url));
    return NextResponse.redirect(new URL('/import/success', "http://127.0.0.1:3000"));

}
