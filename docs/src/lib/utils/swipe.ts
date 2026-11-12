// Sideways swipes on an element, from a finger or a pen, such as on the
// homepage tabs' stage. A swipe takes a direction once it has clearly moved;
// one going up or down is left to the browser to scroll the page.

// How far the pointer moves before the swipe takes a direction, in px.
const SLOP = 10;

interface SwipeHandlers {
  // The pointer has moved `dx` px sideways from where it went down.
  move(dx: number): void;
  // The pointer lifted after moving `dx` px sideways, or the swipe was cut
  // short (`undefined`), as when the browser took it over.
  end(dx: number | undefined): void;
}

export function trackSwipes(
  element: HTMLElement,
  { move, end }: SwipeHandlers,
): void {
  let swipe:
    | { id: number; x: number; y: number; axis?: "x" | "y"; dx: number }
    | undefined;

  element.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" || !event.isPrimary) return;
    swipe = { id: event.pointerId, x: event.clientX, y: event.clientY, dx: 0 };
  });

  element.addEventListener("pointermove", (event) => {
    if (!swipe || event.pointerId !== swipe.id) return;
    const dx = event.clientX - swipe.x;
    const dy = event.clientY - swipe.y;
    if (!swipe.axis) {
      if (Math.hypot(dx, dy) < SLOP) return;
      swipe.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    if (swipe.axis !== "x") return;
    swipe.dx = dx;
    move(dx);
  });

  const finish = (event: PointerEvent) => {
    if (!swipe || event.pointerId !== swipe.id) return;
    const { axis, dx } = swipe;
    swipe = undefined;
    if (axis !== "x") return;
    end(event.type === "pointerup" ? dx : undefined);
  };
  element.addEventListener("pointerup", finish);
  element.addEventListener("pointercancel", finish);
}
