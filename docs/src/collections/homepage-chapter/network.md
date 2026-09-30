---
name: "Network Monitoring"
title: "See every request. Before you set a breakpoint."
color: network
tile:
  title: "Every request, no proxy or certificates."
  poster: /features/posters/network-monitoring-demo.webp
presentation: tabs
items:
  - feature: 01-network-monitoring
    title: "Live inspector"
    description: "JSON, headers, metrics, and logs side by side."
  - feature: 01-network-monitoring
    title: "Copy as cURL"
    description: "Replay any request from your terminal."
    media:
      type: image
      path: ../../content/docs/docs/features/networking/network-traffic-monitoring/network-request-detail.png
      alt: "Request detail view with Summary, Request, Response, Headers, Metrics, and cURL tabs"
  - feature: 03-simulator-airplane-mode
    title: "Speed control"
    description: "3G, Edge, packet loss, or airplane mode."
  - feature: 31-network-ai-prompts
    title: "AI-ready prompts"
    description: "Redacted request context for any assistant."
links:
  - label: "Explore Network Monitoring"
    href: /features/networking/
---

Inspect URLSession requests, responses, headers, and app logs as they happen, **without a proxy or certificates**. Throttle the connection, flip on airplane mode, and hand your AI assistant a privacy-redacted summary.
