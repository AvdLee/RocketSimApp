declare var plausible;
declare var AOS;

declare module "aos";

// Twitter Widgets API
interface TwitterWidgets {
  load(element?: HTMLElement): void;
}

interface Window {
  twttr?: {
    widgets: TwitterWidgets;
  };
}
