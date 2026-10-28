interface LazyVideoState {
  autoPausing: boolean;
  pendingUserAction: boolean;
  userPaused: boolean;
  visible: boolean;
}

const videoStates = new WeakMap<HTMLVideoElement, LazyVideoState>();
let observer: IntersectionObserver | undefined;

// Swaps in the deferred `data-poster`, for videos that defer their poster
// (src/components/home/Media.astro).
function setPoster(video: HTMLVideoElement): void {
  const poster = video.dataset.poster;
  if (poster && !video.hasAttribute("poster")) video.poster = poster;
}

// Gives each homepage video its poster once it is about a screen away. A
// poster downloads as soon as the video has one, `preload="none"` or not, so
// posters in the markup would all load with the page. Returns what stops it
// when the page is left.
export function initLazyPosters(): () => void {
  const observer = new IntersectionObserver(
    (entries, self) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting || !(target instanceof HTMLVideoElement)) return;
        setPoster(target);
        self.unobserve(target);
      });
    },
    { rootMargin: "100% 0px" },
  );

  document
    .querySelectorAll<HTMLVideoElement>("video[data-poster]")
    .forEach((video) => observer.observe(video));

  return () => observer.disconnect();
}

// Swaps in the deferred `data-src` source, and the poster if it is still
// deferred. Also used by presentations that control playback themselves.
export function loadVideo(video: HTMLVideoElement): void {
  setPoster(video);
  if (video.dataset.loaded === "true") return;
  const source = video.querySelector<HTMLSourceElement>("source[data-src]");
  const src = source?.dataset.src;
  if (!source || !src) return;

  source.src = src;
  video.dataset.loaded = "true";
  video.load();
}

function getObserver(): IntersectionObserver {
  observer ??= new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        const state = videoStates.get(video);
        if (!state) return;

        state.visible = entry.isIntersecting;
        if (entry.isIntersecting) {
          loadVideo(video);
          if (!state.userPaused) {
            void video.play().catch(() => {
              // Posters and native controls remain available when autoplay is
              // blocked or playback cannot start.
            });
          }
        } else if (!video.paused) {
          state.autoPausing = true;
          video.pause();
        }
      });
    },
    { threshold: 0.25, rootMargin: "200px 0px" },
  );

  return observer;
}

export function initLazyVideos(): void {
  document
    .querySelectorAll<HTMLVideoElement>(".js-lazy-video")
    .forEach((video) => {
      if (videoStates.has(video)) return;

      const state: LazyVideoState = {
        autoPausing: false,
        pendingUserAction: false,
        userPaused: false,
        visible: false,
      };
      videoStates.set(video, state);

      const noteUserAction = () => {
        state.pendingUserAction = true;
      };
      video.addEventListener("pointerdown", noteUserAction);
      video.addEventListener("keydown", noteUserAction);
      video.addEventListener("play", () => {
        state.userPaused = false;
        state.pendingUserAction = false;
      });
      video.addEventListener("pause", () => {
        if (state.autoPausing) {
          state.autoPausing = false;
        } else if (
          state.visible &&
          video.dataset.loaded === "true" &&
          (state.pendingUserAction || video.currentTime > 0)
        ) {
          state.userPaused = true;
        }
        state.pendingUserAction = false;
      });

      getObserver().observe(video);
    });
}
