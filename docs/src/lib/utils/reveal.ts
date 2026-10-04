import { prefersReducedMotion } from "./motion";

// Timed scroll-in reveals for the homepage, where the browser can't tie them
// to the scroll position (see src/styles/animations.css). Either way the
// homepage reveals instead of using AOS, which stays for the shared footer
// and the rest of the site: its reveals respect reduced motion and share the
// homepage's easing. This fallback never hides content already on screen.

let observer: IntersectionObserver | undefined;

export function initReveals(): void {
  observer?.disconnect();
  // Browsers with scroll-driven animations reveal in CSS, tied to the
  // scroll position (src/styles/animations.css).
  if (prefersReducedMotion() || CSS.supports("animation-timeline: view()")) {
    return;
  }

  observer = new IntersectionObserver(
    (entries, self) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting || !(target instanceof HTMLElement)) return;
        target.dataset.reveal = "shown";
        self.unobserve(target);
      });
    },
    { rootMargin: "0px 0px -10% 0px" },
  );

  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    // Anything on screen, or scrolled past, stays as it is.
    if (element.getBoundingClientRect().top < window.innerHeight) return;
    element.dataset.reveal = "pending";
    observer?.observe(element);
  });
}
