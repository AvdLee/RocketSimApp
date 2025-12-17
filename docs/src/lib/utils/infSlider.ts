interface SliderOptions {
  scrollSpeed: string; // Pixels per second
  direction: "normal" | "reverse";
  pauseOnHover: boolean;
}

export function initInfiniteSliders(): void {
  const sliders: NodeListOf<HTMLElement> = document.querySelectorAll(".inf-slider");

  sliders.forEach((slider: HTMLElement) => {
    const options: SliderOptions = {
      scrollSpeed: slider.dataset.infScrollSpeed || "100", // Default scroll speed 100px/s
      direction: (slider.dataset.infDirection === "reverse" ? "reverse" : "normal") as "normal" | "reverse",
      pauseOnHover: slider.dataset.infSlidePauseOnHover === "true",
    };

    const track: HTMLElement | null = slider.querySelector(".inf-slide-track");
    if (!track) return;

    const slides: HTMLCollectionOf<HTMLElement> = track.getElementsByClassName(
      "inf-slide"
    ) as HTMLCollectionOf<HTMLElement>;
    const numSlides: number = slides.length;

    if (numSlides === 0) return;

    // Calculate total width of all slides
    let totalWidth = 0;
    const slideWidths: number[] = [];

    Array.from(slides).forEach((slide: HTMLElement) => {
      const width = slide.offsetWidth;
      slideWidths.push(width);
      totalWidth += width;
    });

    // Clone slides
    Array.from(slides).forEach((slide: HTMLElement, index: number) => {
      const clone: Node = slide.cloneNode(true);
      (clone as HTMLElement).style.width = `${slideWidths[index]}px`; // Set explicit width on clones
      track.appendChild(clone);
    });

    // Set track width to accommodate all slides (original + cloned)
    track.style.width = `${totalWidth * 2}px`;

    // Calculate animation duration based on scrollSpeed (pixels per second)
    const scrollSpeed: number = parseFloat(options.scrollSpeed);
    const animationDuration: number = (totalWidth * 2) / scrollSpeed; // time = distance / speed

    // Create a custom property with all slide widths
    const slideWidthsString = slideWidths.join("px ") + "px";
    slider.style.setProperty("--slide-widths", slideWidthsString);

    // Set the animation with calculated duration
    const animationName = `inf-scroll${options.direction === "reverse" ? "-reverse" : ""}`;
    track.style.animation = `${animationName} ${animationDuration}s linear infinite`;

    // Add pause on hover functionality
    if (options.pauseOnHover) {
      slider.addEventListener("mouseenter", () => {
        track.style.animationPlayState = "paused";
      });

      slider.addEventListener("mouseleave", () => {
        track.style.animationPlayState = "running";
      });
    }
  });
}
