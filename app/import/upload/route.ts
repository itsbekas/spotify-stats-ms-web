import { NextRequest } from "next/server";
import { jsonIsValid } from "@/lib/files/validate_json";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    // validate json
    const json = request.json();
    
    return NextResponse.json({ data: json });

}