import { appStoreUrl } from "./appStoreUrl";

// Remembers the first-touch referer (cookie, 7 days), points the hero App Store
// button (`#js-header-app-store-button`) at it as the `ct=` campaign, and sends
// the `Stored Referer` Plausible event. Shared by the homepage and its preview.
export function initStoredReferer(): void {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  let referer: string | null = null;

  // First see if we already have a referer stored. We want to use the first-referer possible.
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");
    if (name === "referer") {
      referer = decodeURIComponent(value);
    }
  });

  // Even if we fetched the cookie value, we want new campaigns or refs to take over.
  referer = urlParams.get("utm_campaign") || urlParams.get("ref") || referer;

  // If referer is not set, try using referer header as referer.
  if (!referer) {
    const refererHeader = document.referrer;
    if (refererHeader) {
      const refererHost = new URL(refererHeader).hostname;
      if (refererHost) {
        referer = refererHost;
      }
    }
  }

  // Remember referer for future usage.
  if (referer) {
    const expirationTime = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toUTCString();
    document.cookie = `referer=${encodeURIComponent(referer)}; expires=${expirationTime}; path=/`;
  }

  // Use the referer as the campaign or fallback to 'website-header'
  const campaign = referer || "website-header";

  const a = document.getElementById("js-header-app-store-button");
  if (a instanceof HTMLAnchorElement) {
    a.href = appStoreUrl(campaign);
  }

  plausible("Stored Referer", { props: { stored_referer: campaign } });
}
