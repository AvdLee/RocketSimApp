// Runs a homepage script on every load of the page, client-side navigations
// included, and whatever it returns when a navigation is about to replace the
// page, so nothing of the old page's script outlives it: no observers, window
// listeners, frames or playing videos.
export function onPage(init: () => (() => void) | undefined): void {
  document.addEventListener("astro:page-load", () => {
    const stop = init();
    if (stop) {
      document.addEventListener("astro:before-swap", stop, { once: true });
    }
  });
}
