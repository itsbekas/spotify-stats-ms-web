import { permanentRedirect } from "next/navigation";
import { fetchAPI } from "@/lib/api";

async function fetchAuthURL() {
    const res = await fetchAPI("/login");
    if (!res.ok) return undefined;
    const loginURL = await res.json();
    return loginURL;
}

export async function GET() {
    const loginURL = await fetchAuthURL();
    permanentRedirect(loginURL);
}
