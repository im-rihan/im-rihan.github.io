import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./env";

/**
 * Server Supabase client for App Router (local dev / future SSR).
 * Not used on GitHub Pages static export — analytics uses getBrowserClient() instead.
 */
export async function createClient() {
    const cookieStore = await cookies();
    const { url, key } = getSupabaseEnv();
    if (!url || !key) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    }

    return createServerClient(url, key, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                } catch {
                    /* setAll from Server Component — safe to ignore without middleware */
                }
            },
        },
    });
}
