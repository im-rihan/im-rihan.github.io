/** Scroll to a section id with fixed-navbar offset. */

function navOffset() {
    const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--nav-h") || "68",
        10
    );
    return navH;
}

export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
    const el = document.getElementById(id);
    if (!el) return false;

    const top = el.getBoundingClientRect().top + window.scrollY - navOffset();
    window.scrollTo({ top: Math.max(0, top), behavior });
    return true;
}

/** Smooth scroll + hash update (navbar sections, hero CTA, contact dock). */
export function navigateToSection(id: string) {
    scrollToSection(id);
    window.history.replaceState(null, "", `/#${id}`);
}
