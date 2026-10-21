---
name: "Network Monitoring"
menuLabel: "Network"
title: "See every request. Before you set a breakpoint."
color: network
tile:
  title: "Every request, no proxy or certificates."
  poster: /features/posters/network-monitoring-demo.webp
presentation: tabs
items:
  - feature: 01-network-monitoring
    title: "Live inspector"
    description: "JSON, headers, metrics, and app logs in one place."
    media:
      type: video
      path: /features/network-monitoring-demo-60fps.mp4
      alt: "The Networking tab filling up live while Stock Analyzer loads stocks"
    bleed: true
  - feature: 01-network-monitoring
    title: "Headers and JSON"
    description: "Read any response or header, then replay it as cURL."
    media:
      type: video
      path: /features/network-headers-json-60fps.mp4
      alt: "The Network Monitor window switching between the Response and Headers of a request"
    bleed: true
  - feature: 02-network-speed-control
    title: "Speed control"
    description: "3G, Edge, 100% loss, or airplane mode."
    media:
      type: video
      path: /features/network-speed-control-60fps.mp4
      alt: "Choosing Airplane Mode in Network Speed Control and opening its info popover"
    bleed: true
  - feature: 31-network-ai-prompts
    title: "AI-ready prompts"
    description: "Redacted request context for any assistant."
    media:
      type: video
      path: /features/network-ai-prompts-60fps.mp4
      alt: "Copying the Redundant calls and caching prompt from the Network Monitor"
    bleed: true
links:
  - label: "Explore Network Monitoring"
    href: /features/networking/
---

Inspect URLSession requests, responses, headers, and app logs as they happen, **without a proxy or certificates**. Throttle the connection, flip on airplane mode, and hand your AI assistant a privacy-redacted summary.
