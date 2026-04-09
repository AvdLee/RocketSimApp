---
showOnHomepage: true
name: "VoiceOver Navigator"
featurePage: "accessibility"
tagLine: "Visualize VoiceOver element order right on the Simulator"
asset:
  type: "image"
  path: "../../assets/features/voiceover-navigator.png"
  alt: "VoiceOver Navigator showing numbered accessibility elements overlaid on the Simulator, allowing you to verify reading order without a physical device."
  alignment: "full-width"
  columnSpan: 12
---

Testing VoiceOver used to mean grabbing a physical device, enabling VoiceOver, and swiping through your app to hear the order of elements. It works, but it pulls you out of your development flow — you're constantly switching between Simulator and device, and the gesture-based navigation can feel slow when you're iterating.

VoiceOver Navigator keeps you in the Simulator. It overlays numbered labels on each accessibility element in the same order VoiceOver would use, so you can see at a glance whether your reading order makes sense. You can:

- **Arrow up and down** — move through elements in VoiceOver order
- **Arrow left and right** — switch between rotor categories (like swiping on device)
- **Enter** — activate the focused element (e.g. tap a button); the app navigates and the overlay updates
- **Search** — find elements by name or type
- **Rotor** — manually select which rotor category to use
- **Overlay** — turn the numbered overlay on or off
- **Stay in flow** — verify accessibility behavior without moving to a physical device

No device, no gestures, no context switch. You get a much quicker loop for checking VoiceOver behavior while you develop.
