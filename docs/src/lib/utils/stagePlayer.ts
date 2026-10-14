import { loadVideo } from "./lazyVideo";
import { prefersReducedMotion } from "./motion";

// The videos on a presentation's stage: one item shows at a time, and only
// its video plays, only while the stage is in view. Videos in other items
// never load. With reduced motion a video never starts by itself: the one
// showing waits on its poster, with controls to play it by hand.
interface StagePlayerOptions {
  stage: HTMLElement;
  // In display order; `null` for items without a video.
  videos: (HTMLVideoElement | null)[];
  // How much of the stage must be in the window for it to count as in view.
  threshold: number;
  // The stage came into or left view.
  onView?: (inView: boolean) => void;
  // A video could not start.
  onFail?: (index: number) => void;
}

export function createStagePlayer({
  stage,
  videos,
  threshold,
  onView,
  onFail,
}: StagePlayerOptions) {
  const reducedMotion = prefersReducedMotion();
  let inView = false;
  let current: number | undefined;
  let playing = false;

  const sync = () => {
    videos.forEach((video, index) => {
      if (!video) return;
      const showing = index === current && inView;
      if (!showing || !playing) {
        video.pause();
        if (showing && reducedMotion) {
          loadVideo(video);
          video.controls = true;
        }
        return;
      }
      loadVideo(video);
      video.play().catch((error: unknown) => {
        // A pause interrupted the start; nothing went wrong.
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        onFail?.(index);
      });
    });
  };

  const visibility = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      sync();
      onView?.(inView);
    },
    { threshold },
  );
  visibility.observe(stage);

  return {
    inView: () => inView,
    // Item `index` shows now; its video plays when `play` is set.
    show(index: number, play: boolean) {
      current = index;
      playing = play;
      sync();
    },
    // The page is being left: stop watching the stage and playing.
    stop() {
      visibility.disconnect();
      videos.forEach((video) => video?.pause());
    },
  };
}
