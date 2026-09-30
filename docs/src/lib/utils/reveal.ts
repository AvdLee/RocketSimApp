// Scroll-in reveals for the homepage, styled in src/styles/animations.css.
// The homepage uses these instead of AOS, which stays for the shared footer
// and the rest of the site: they respect reduced motion, share the
// homepage's easing, and never hide content that is already on screen.

let observer: IntersectionObserver | undefined;

export function initReveals(): void {
  observer?.disconnect();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
