import { figureAt, parseFigure } from "./figure";
import { prefersReducedMotion } from "./motion";

const DURATION_MS = 1600;

// Eases out, so the count slows as it lands on the figure.
const easeOut = (t: number) => 1 - (1 - t) ** 4;

// Figures marked `data-count-up` count up from zero the first time they
// come into view. The markup keeps the real figure, so without the script,
// or with reduced motion, it simply shows.
export function initCountUps(): void {
  if (prefersReducedMotion()) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting || !(target instanceof HTMLElement)) return;
        observer.unobserve(target);
        countUp(target);
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
}

function countUp(element: HTMLElement) {
  const text = element.textContent ?? "";
  const figure = parseFigure(text.trim());
  if (!figure) return;

  // Holds the final width, so the text around the figure doesn't shift
  // while the digits count.
  element.style.display = "inline-block";
  element.style.minWidth = `${element.getBoundingClientRect().width}px`;

  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / DURATION_MS);
    element.textContent = figureAt(figure, easeOut(progress));
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = text;
    }
  };
  element.textContent = figureAt(figure, 0);
  requestAnimationFrame(step);
}
