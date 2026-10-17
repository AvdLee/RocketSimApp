---
name: "Design & Accessibility"
menuLabel: "Design"
title: "Pixel-perfect, and usable by everyone."
color: design
tile:
  title: "Pixel-perfect, and usable by everyone."
  poster: /features/posters/onboarding-compare.webp
presentation: closer-look
items:
  - feature: 05-compare-designs
    title: "Compare designs"
    description: "Drop in the design and check your build with an overlay or a slider. Differences jump out right in the Simulator."
    media:
      type: video
      path: /features/side-window-comparing-60fps.mp4
      alt: "The Comparing slider sweeping across a light design laid over the live dark Stock Analyzer watchlist"
    bleed: true
  - feature: 06-grids
    title: "Grids"
    description: "Overlay a grid to align elements across the screen. Change its color and spacing to match your design system."
  - feature: 07-rulers
    title: "Rulers"
    description: "Horizontal and vertical rulers show exact positions in points. Hold ⇧ Shift to see the distance between them."
  - feature: 09-magnify
    title: "Magnifier and color picker"
    description: "Hold ⇧ Shift to magnify any pixel, then copy its color as SwiftUI, UIColor, or NSColor code."
  - feature: 08-slow-animations
    title: "Slow animations"
    description: "Slow every animation down to catch the frame where a transition goes wrong."
  - title: "Accessibility audit"
    description: "Find missing labels, small touch targets, and low contrast on the screen you are looking at. Select a finding to see it highlighted in the Simulator."
    media:
      type: image
      path: ../../assets/homepage/side-window-accessibility.png
      alt: "The Audit tab listing hit region findings for Stock Analyzer, with the selected Discounted Cash Flow button highlighted in the Simulator"
    bleed: true
  - feature: 20-voiceover-navigator
    title: "VoiceOver Navigator"
    description: "See the VoiceOver reading order as numbered labels, and walk through it with your arrow keys. No device needed."
    media:
      type: image
      path: ../../content/docs/docs/features/accessibility/voiceover-navigator/voiceover-navigation.png
      alt: "VoiceOver Navigator in navigation mode, with numbered elements on the Simulator, the Watchlist button focused, and arrow-key shortcuts"
  - feature: 14-environment-overrides
    title: "Environment overrides"
    description: "Switch Dynamic Type sizes, bold text, inverted colors, and reduce motion without digging through Settings."
links:
  - label: "Explore design tools"
    href: /features/design-comparison/
  - label: "Explore accessibility"
    href: /features/accessibility/
---

Overlay the design on your running app, measure with grids and rulers, and slow animations down to catch every frame. **VoiceOver Navigator** shows the reading order right on the Simulator — no device needed.
