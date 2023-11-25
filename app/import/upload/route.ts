import { NextRequest } from "next/server";
import { jsonIsValid } from "@/lib/files/validate_json";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    console.log(await request.json());

    console.log("teste1");
    // validate json
    const data = request.json();
    
    return NextResponse.json({ data });

}