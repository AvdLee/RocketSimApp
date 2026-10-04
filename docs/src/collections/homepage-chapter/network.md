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
  - feature: 01-network-monitoring
    title: "Copy as cURL"
    description: "Replay any request from your terminal."
    media:
      type: image
      path: ../../content/docs/docs/features/networking/network-traffic-monitoring/network-request-detail.png
      alt: "Request detail view with Summary, Request, Response, Headers, Metrics, and cURL tabs"
  - feature: 02-network-speed-control
    title: "Speed control"
    description: "3G, Edge, 100% loss, or airplane mode."
    media:
      type: image
      path: ../../content/docs/docs/features/networking/network-speed-control/side_window_network_speed_control_modes_picker_visible.png
      alt: "Network Speed Control picker listing Airplane Mode, 100% Loss, 3G, DSL, Edge, LTE, Very Bad Network, and Wi-Fi"
  - feature: 31-network-ai-prompts
    title: "AI-ready prompts"
    description: "Redacted request context for any assistant."
links:
  - label: "Explore Network Monitoring"
    href: /features/networking/
---

Inspect URLSession requests, responses, headers, and app logs as they happen, **without a proxy or certificates**. Throttle the connection, flip on airplane mode, and hand your AI assistant a privacy-redacted summary.
