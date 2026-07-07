import type { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv, isSupabaseEnvConfigured } from "./env";

type BrowserClient = ReturnType<typeof createBrowserClient>;

/**
 * Browser Supabase client — used by visitor analytics on GitHub Pages (static export).
 *
 * `@supabase/ssr` (and its transitive deps) is a ~250KB dependency that only this
 * analytics path needs, so it's dynamically imported instead of loaded eagerly. That
 * keeps it out of the shared app bundle that every page/route pays for on first load —
 * it's fetched as its own chunk only once a visit actually needs to be read/recorded.
 */
async function createClient(): Promise<BrowserClient> {
    const { url, key } = getSupabaseEnv();
    if (!url || !key) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    }
    const { createBrowserClient } = await import("@supabase/ssr");
    return createBrowserClient(url, key);
}

let browserClient: BrowserClient | null = null;
let browserClientPromise: Promise<BrowserClient> | null = null;

/** Singleton browser client for client components. */
export async function getBrowserClient(): Promise<BrowserClient | null> {
    if (!isSupabaseEnvConfigured()) return null;
    if (browserClient) return browserClient;
    if (!browserClientPromise) {
        browserClientPromise = createClient().then((client) => {
            browserClient = client;
            return client;
        });
    }
    return browserClientPromise;
}
