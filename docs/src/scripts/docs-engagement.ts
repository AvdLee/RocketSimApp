declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string> },
    ) => void;
  }
}

const trackDocsEvent = (eventName: string, props?: Record<string, string>) => {
  if (typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible(eventName, props ? { props } : undefined);
  }
};

const initializeDocsEngagement = () => {
  const content = document.querySelector("article .sl-markdown-content");
  const templateRoot = document.querySelector("[data-docs-cta-templates]");

  if (content && templateRoot) {
    const [inlineTemplate, bottomTemplate] =
      templateRoot.querySelectorAll("[data-docs-cta]");

    if (inlineTemplate && !content.querySelector('[data-placement="inline"]')) {
      const majorSections = content.querySelectorAll(
        ":scope > h2, :scope > section",
      );
      const inlineCta = inlineTemplate.cloneNode(true) as HTMLElement;
      inlineCta.removeAttribute("hidden");

      const firstMajorSection = majorSections[0];
      if (firstMajorSection?.nextSibling) {
        firstMajorSection.parentNode?.insertBefore(
          inlineCta,
          firstMajorSection.nextSibling,
        );
      } else {
        content.appendChild(inlineCta);
      }
      trackDocsEvent("Docs CTA Impression", { placement: "inline" });
    }

    if (bottomTemplate && !content.querySelector('[data-placement="bottom"]')) {
      const bottomCta = bottomTemplate.cloneNode(true) as HTMLElement;
      bottomCta.removeAttribute("hidden");
      content.appendChild(bottomCta);
      trackDocsEvent("Docs CTA Impression", { placement: "bottom" });
    }
  }

  document.querySelectorAll("[data-docs-cta-click]").forEach((ctaLink) => {
    ctaLink.addEventListener("click", () => {
      const eventName = ctaLink.getAttribute("data-analytics-event");
      if (eventName) trackDocsEvent(eventName);
    });
  });

  const storageKey = "rocketsim_docs_banner_dismissed";
  const banner = document.querySelector(
    "[data-docs-install-banner]",
  ) as HTMLElement | null;
  if (!banner) return;

  if (localStorage.getItem(storageKey) === "1") return;
  banner.hidden = false;
  trackDocsEvent("Docs Banner Shown");

  const dismissButton = banner.querySelector(".docs-install-banner__dismiss");
  dismissButton?.addEventListener("click", () => {
    banner.hidden = true;
    localStorage.setItem(storageKey, "1");
    trackDocsEvent("Docs Banner Dismissed");
  });

  const bannerCta = banner.querySelector(".docs-install-banner__cta");
  bannerCta?.addEventListener("click", () =>
    trackDocsEvent("Docs Banner Click"),
  );
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeDocsEngagement, {
    once: true,
  });
} else {
  initializeDocsEngagement();
}

export {};
