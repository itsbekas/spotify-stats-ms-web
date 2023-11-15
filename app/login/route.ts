import { permanentRedirect } from "next/navigation";
import { fetchAuthURL } from "@/lib/auth/spotify";

export async function GET() {

    const authURL: string | undefined = await fetchAuthURL();

    permanentRedirect(authURL!);
}
