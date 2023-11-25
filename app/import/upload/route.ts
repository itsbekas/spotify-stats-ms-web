import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    // validate json
    const data = await request.json();
    
    return NextResponse.json(data);

}