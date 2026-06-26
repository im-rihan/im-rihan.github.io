import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabaseEnv } from "./env";

/**
 * Middleware helper from Supabase docs.
 * GitHub Pages static export does not run Next.js middleware — keep for Vercel/Node deploys only.
 */
export function createClient(request: NextRequest) {
    const { url, key } = getSupabaseEnv();
    if (!url || !key) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    }

    let supabaseResponse = NextResponse.next({
        request: { headers: request.headers },
    });

    createServerClient(url, key, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                supabaseResponse = NextResponse.next({ request });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                );
            },
        },
    });

    return supabaseResponse;
}
