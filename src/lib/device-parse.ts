export interface DeviceInfo {
    deviceType: "desktop" | "mobile" | "tablet" | "unknown";
    deviceLabel: string;
    browser: string;
    os: string;
}

export interface DeviceParseHints {
    maxTouchPoints?: number;
}

export function parseDevice(ua: string, hints: DeviceParseHints = {}): DeviceInfo {
    const lower = ua.toLowerCase();

    let browser = "Browser";
    if (lower.includes("linkedinapp") || lower.includes("linkedin")) browser = "LinkedIn";
    else if (lower.includes("fbav") || lower.includes("fban") || lower.includes("facebook")) browser = "Facebook";
    else if (lower.includes("instagram")) browser = "Instagram";
    else if (lower.includes("samsungbrowser")) browser = "Samsung Internet";
    else if (lower.includes("edg/")) browser = "Edge";
    else if (lower.includes("opr/") || lower.includes("opera")) browser = "Opera";
    else if (lower.includes("chrome/")) browser = "Chrome";
    else if (lower.includes("firefox/")) browser = "Firefox";
    else if (lower.includes("safari/") && !lower.includes("chrome")) browser = "Safari";

    // iOS UAs contain "like Mac OS X" — check Apple mobile before macOS.
    let os = "Unknown";
    if (/iphone|ipod/.test(lower)) os = "iOS";
    else if (/ipad/.test(lower)) os = "iOS";
    else if (lower.includes("android")) os = "Android";
    else if (lower.includes("windows")) os = "Windows";
    else if (lower.includes("mac os")) os = "macOS";
    else if (lower.includes("linux")) os = "Linux";

    const maxTouchPoints = hints.maxTouchPoints ?? 0;
    const iosSafariDesktopUa =
        os === "macOS" && browser === "Safari" && maxTouchPoints > 1;
    if (iosSafariDesktopUa) {
        os = "iOS";
    }

    let deviceType: DeviceInfo["deviceType"] = "desktop";
    if (/ipad|tablet/.test(lower) || (iosSafariDesktopUa && maxTouchPoints > 2)) {
        deviceType = "tablet";
    } else if (/mobile|android|iphone|ipod/.test(lower) || iosSafariDesktopUa) {
        deviceType = "mobile";
    }

    const deviceLabel =
        deviceType === "mobile" ? `Mobile · ${os}` :
        deviceType === "tablet" ? `Tablet · ${os}` :
        `Desktop · ${os}`;

    return { deviceType, deviceLabel, browser, os };
}

/** Normalize browser names for analytics grouping. */
export function normalizeBrowserLabel(browser: string): string {
    const b = browser.trim();
    if (/chrome|edge|samsung|opera/i.test(b)) return "Chrome family";
    if (/safari/i.test(b)) return "Safari";
    if (/firefox/i.test(b)) return "Firefox";
    if (/linkedin|facebook|instagram/i.test(b)) return "In-app browser";
    return "Other";
}
