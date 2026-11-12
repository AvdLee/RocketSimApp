import { indexForKey, type Orientation } from "./presentationIndex";

// Arrow keys along `orientation`, Home and End move focus between `controls`
// and activate the control they land on. Pass a function for controls whose
// layout turns with the window; it is asked on every key.
export function bindRovingKeys(
  controls: HTMLElement[],
  orientation: Orientation | (() => Orientation),
  activate: (index: number) => void,
): void {
  controls.forEach((control, index) => {
    control.addEventListener("keydown", (event) => {
      const next = indexForKey(
        event.key,
        index,
        controls.length,
        typeof orientation === "function" ? orientation() : orientation,
      );
      if (next === undefined) return;
      event.preventDefault();
      activate(next);
      controls[next].focus();
    });
  });
}
