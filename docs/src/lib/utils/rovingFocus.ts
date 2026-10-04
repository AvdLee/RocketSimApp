import { indexForKey, type Orientation } from "./presentationIndex";

// Arrow keys along `orientation`, Home and End move focus between `controls`
// and activate the control they land on.
export function bindRovingKeys(
  controls: HTMLElement[],
  orientation: Orientation,
  activate: (index: number) => void,
): void {
  controls.forEach((control, index) => {
    control.addEventListener("keydown", (event) => {
      const next = indexForKey(event.key, index, controls.length, orientation);
      if (next === undefined) return;
      event.preventDefault();
      activate(next);
      controls[next].focus();
    });
  });
}
