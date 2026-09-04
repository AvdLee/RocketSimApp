interface LazyVideoState {
  autoPausing: boolean;
  pendingUserAction: boolean;
  userPaused: boolean;
  visible: boolean;
}

const videoStates = new WeakMap<HTMLVideoElement, LazyVideoState>();
let observer: IntersectionObserver | undefined;

function loadVideo(video: HTMLVideoElement): void {
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
