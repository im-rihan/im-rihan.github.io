import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseEnvConfigured } from "./env";

/** Browser Supabase client — used by visitor analytics on GitHub Pages (static export). */
export function createClient() {
    const { url, key } = getSupabaseEnv();
    if (!url || !key) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    }
    return createBrowserClient(url, key);
}

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/** Singleton browser client for client components. */
export function getBrowserClient() {
    if (!isSupabaseEnvConfigured()) return null;
    if (!browserClient) {
        browserClient = createClient();
    }
    return browserClient;
}
