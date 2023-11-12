import { permanentRedirect } from "next/navigation";
import { fetchAPI } from "@/lib/api";

export async function GET() {
    const res = await fetchAPI("/login");
    if (!res.ok) return undefined;
    const loginURL = await res.json();
    permanentRedirect(loginURL);
}
