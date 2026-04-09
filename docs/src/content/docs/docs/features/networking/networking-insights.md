---
title: "Networking Insights"
description: "Analyze historical network traffic patterns, spot duplicate API calls, identify slow endpoints, and debug failures across sessions with Networking Insights."
---

::::note
Networking Insights is available in RocketSim 15 and works best after you have [RocketSim Connect](/docs/getting-started/setting-up-rocketsim-connect) configured.
::::

While [Network Traffic Monitoring](/docs/features/networking/network-traffic-monitoring) shows you requests in real time, Networking Insights gives you a historical view. Open it from the **Welcome** view via **Network Insights** in the sidebar. You can analyze past requests, spot patterns, and export a filtered request set as a compact summary or a built-in AI prompt.

## How it differs from Network Traffic Monitoring

[Network Traffic Monitoring](/docs/features/networking/network-traffic-monitoring) captures requests as they happen. Networking Insights stores and analyzes that data over time, making it easier to find recurring issues or compare request patterns across sessions.

## What you can analyze

Use the toolbar to filter by **app** and **time range** (All Time, Last 7 Days, Last 30 Days, Last Hour). Insights are grouped into:

- **Failure Spikes** — Catch error spikes before they reach users.
- **Duplicate Calls** — Reduce duplicate calls and improve performance.
- **Caching Opportunities** — Find endpoints that may benefit from cache headers.
- **Slowest Endpoints** — Target slow requests to improve perceived performance.
- **Most Requested** — Understand your highest traffic endpoints.

![Network Insights overview with failure spikes, duplicate calls, and slowest endpoints](./network-traffic-monitoring/network-insights-overview.png)

## Using request data with AI assistants

From the toolbar, RocketSim can generate:

- **Copy export** for a compact redacted export of the filtered request set
- **Copy prompt** for built-in prompt templates such as redundant calls and caching, performance and overfetching, or failures and error spikes

From the detail view, you can still copy the request, response, headers, or cURL for a single request when you want the full low-level data.

For the full workflow, see [Exporting Network Requests as Prompts](/docs/features/networking/network-request-prompts).

Networking Insights requires [RocketSim Connect](/docs/getting-started/setting-up-rocketsim-connect) to be set up.
