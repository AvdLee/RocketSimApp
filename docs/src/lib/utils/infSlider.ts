interface SliderOptions {
  scrollSpeed: string; // Pixels per second
  direction: "normal" | "reverse";
  pauseOnHover: boolean;
  pauseOnFocus: boolean;
}

interface SliderState {
  remeasure: () => void;
}

const sliderStates = new WeakMap<HTMLElement, SliderState>();
const cloneSelector = "[data-inf-slider-clone]";
const focusableSelector =
  'a[href], button, input, select, textarea, summary, [tabindex]:not([tabindex="-1"])';

export function initInfiniteSliders(): void {
  const sliders: NodeListOf<HTMLElement> =
    document.querySelectorAll(".inf-slider");

  sliders.forEach((slider: HTMLElement) => {
    const existingState = sliderStates.get(slider);
    if (existingState) {
      existingState.remeasure();
      return;
    }

    const options: SliderOptions = {
      scrollSpeed: slider.dataset.infScrollSpeed || "100", // Default scroll speed 100px/s
      direction: (slider.dataset.infDirection === "reverse"
        ? "reverse"
        : "normal") as "normal" | "reverse",
      pauseOnHover: slider.dataset.infSlidePauseOnHover === "true",
      pauseOnFocus: slider.dataset.infSlidePauseOnFocus === "true",
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let resizeTimer: number | undefined;

    const setAnimationState = (state: "paused" | "running") => {
      const track = slider.querySelector<HTMLElement>(".inf-slide-track");
      if (track) track.style.animationPlayState = state;
    };

    const remeasure = () => {
      const track = slider.querySelector<HTMLElement>(".inf-slide-track");
      if (!track) return;

      track.querySelectorAll<HTMLElement>(cloneSelector).forEach((clone) => {
        clone.remove();
      });
      track.style.removeProperty("animation");
      track.style.removeProperty("animation-play-state");
      track.style.removeProperty("width");

      const slides = Array.from(
        track.querySelectorAll<HTMLElement>(`.inf-slide:not(${cloneSelector})`),
      );
      if (slides.length === 0 || motionQuery.matches) return;

      const slideWidths = slides.map(
        (slide) => slide.getBoundingClientRect().width,
      );
      const totalWidth = slideWidths.reduce((sum, width) => sum + width, 0);

      slides.forEach((slide, index) => {
        const clone = slide.cloneNode(true) as HTMLElement;
        clone.dataset.infSliderClone = "true";
        clone.setAttribute("aria-hidden", "true");
        clone.style.boxSizing = "border-box";
        clone.style.width = `${slideWidths[index]}px`;

        clone.querySelectorAll<HTMLElement>("[id]").forEach((element) => {
          element.removeAttribute("id");
        });
        if (clone.matches(focusableSelector)) clone.tabIndex = -1;
        clone
          .querySelectorAll<HTMLElement>(focusableSelector)
          .forEach((element) => {
            element.tabIndex = -1;
          });
        track.appendChild(clone);
      });

      track.style.width = `${totalWidth * 2}px`;
      const parsedSpeed = parseFloat(options.scrollSpeed);
      const scrollSpeed =
        Number.isFinite(parsedSpeed) && parsedSpeed > 0 ? parsedSpeed : 100;
      const animationDuration = totalWidth / scrollSpeed;
      const animationName = `inf-scroll${options.direction === "reverse" ? "-reverse" : ""}`;
      track.style.animation = `${animationName} ${animationDuration}s linear infinite`;

      if (
        (options.pauseOnHover && slider.matches(":hover")) ||
        (options.pauseOnFocus && slider.contains(document.activeElement))
      ) {
        setAnimationState("paused");
      }
    };

    sliderStates.set(slider, { remeasure });
    slider.dataset.infSliderInitialized = "true";

    if (options.pauseOnHover) {
      slider.addEventListener("mouseenter", () => {
        setAnimationState("paused");
      });

      slider.addEventListener("mouseleave", () => {
        if (!options.pauseOnFocus || !slider.contains(document.activeElement)) {
          setAnimationState("running");
        }
      });
    }

    if (options.pauseOnFocus) {
      slider.addEventListener("focusin", () => {
        setAnimationState("paused");
      });

      slider.addEventListener("focusout", (event: FocusEvent) => {
        const nextTarget = event.relatedTarget;
        if (
          !(nextTarget instanceof Node && slider.contains(nextTarget)) &&
          (!options.pauseOnHover || !slider.matches(":hover"))
        ) {
          setAnimationState("running");
        }
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(remeasure, 120);
    });
    resizeObserver.observe(slider);
    motionQuery.addEventListener("change", remeasure);

    remeasure();
  });
}
