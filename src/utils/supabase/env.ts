export function getSupabaseEnv(): { url: string; key: string } {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
    const key = (
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )?.trim() ?? "";
    return { url, key };
}

export function isSupabaseEnvConfigured(): boolean {
    const { url, key } = getSupabaseEnv();
    return Boolean(url && key);
}
