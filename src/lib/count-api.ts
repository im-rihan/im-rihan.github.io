/** CountAPI global counters — opt out with NEXT_PUBLIC_COUNTAPI_ENABLED=false. */
export function isCountApiEnabled(): boolean {
    return process.env.NEXT_PUBLIC_COUNTAPI_ENABLED !== "false";
}
