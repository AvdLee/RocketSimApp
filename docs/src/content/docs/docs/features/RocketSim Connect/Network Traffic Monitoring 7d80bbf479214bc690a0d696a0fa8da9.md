# Network Traffic Monitoring

Article Description: Monitor in- and outgoing network requests for your application.
Published: Yes
Suggested: Yes

Powered by RocketSim Connect, you’re able to monitor in- and outgoing network requests for your app.

![Networking Tools Details.jpeg](Network%20Traffic%20Monitoring/Networking_Tools_Details.jpeg)

Being able to see which requests are running is essential for a fast development workflow.

## How does this work?

RocketSim Connect’s dynamic library gets loaded at runtime and swizzles URLSession methods to catch networking activity.

## How do I get started?

Follow the instructions for RocketSim Connect as described [here](https://docs.rocketsim.app/features/hzQMSrSga7BGWvxdNVdwYs/introduction/iXHZvJWvedgZuVTN5V3YS1).

## Do I need to set up a proxy or certificates?

Nope! Integrating RocketSim Connect is all you need.

## Are you saying I don’t need Proxyman, Charles Proxy, or any other proxy app anymore?

Basically, yes! However, RocketSim does not yet allow configuring breakpoints or adjusting responses before they return into your app. Though, in most cases, it’s enough to be able to see which requests go in and out, what respones they return, and why a request failed.

## Powered by open-sourced framework Pulse

Network monitoring is made possible by [Pulse](https://github.com/kean/Pulse), an open-sourced library developed by [Alex Grebenyuk](https://github.com/kean). For a more advanced Network Logger that includes powerful mocking capabilities, advanced filtering, and more — check out [Pulse Pro](https://pulselogger.com/).

## I see things that can be improved, can I contribute?

Yes! Since RocketSim uses [Pulse](https://github.com/kean/Pulse), you’re able to create a fork and commit any changes you like. RocketSim will regularly merge latest changes, so you’re able to improve RocketSim.