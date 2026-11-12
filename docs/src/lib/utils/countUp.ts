import { figureAt, parseFigure } from "./figure";
import { prefersReducedMotion } from "./motion";

const DURATION_MS = 1600;

// Eases out, so the count slows as it lands on the figure.
const easeOut = (t: number) => 1 - (1 - t) ** 4;

// Figures marked `data-count-up` count up from zero the first time they
// come into view. The markup keeps the real figure, so without the script,
// or with reduced motion, it simply shows. Returns what stops it when the
// page is left: figures still waiting stay as they are, and those mid-count
// settle on their figure.
export function initCountUps(): () => void {
  if (prefersReducedMotion()) return () => {};

  // What ends each count-up still running.
  const active = new Set<() => void>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting || !(target instanceof HTMLElement)) return;
        observer.unobserve(target);
        countUp(target, active);
      });
    },
    { threshold: 1 },
  );

  document
    .querySelectorAll<HTMLElement>("[data-count-up]")
    .forEach((element) => {
      // Figures already on screen stay as they are.
      if (element.getBoundingClientRect().top < window.innerHeight) return;
      observer.observe(element);
    });

  return () => {
    observer.disconnect();
    active.forEach((finish) => finish());
  };
}

// Counts `element` up to its figure. While it counts, `active` holds what
// ends it early, landing it on the figure at once.
function countUp(element: HTMLElement, active: Set<() => void>) {
  const text = element.textContent ?? "";
  const figure = parseFigure(text.trim());
  if (!figure) return;

  // Holds the final width, so the text around the figure doesn't shift
  // while the digits count.
  element.style.display = "inline-block";
  element.style.minWidth = `${element.getBoundingClientRect().width}px`;

  const start = performance.now();
  let frame = 0;
  const land = () => {
    frame = 0;
    element.textContent = text;
    active.delete(finish);
  };
  const finish = () => {
    if (!frame) return;
    cancelAnimationFrame(frame);
    land();
  };
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / DURATION_MS);
    if (progress < 1) {
      element.textContent = figureAt(figure, easeOut(progress));
      frame = requestAnimationFrame(step);
    } else {
      land();
    }
  };
  element.textContent = figureAt(figure, 0);
  frame = requestAnimationFrame(step);
  active.add(finish);
}
