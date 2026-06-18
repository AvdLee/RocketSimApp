---
title: "Choose the RocketSim plan for <em>your workflow</em>"

plans:
  - enable: true
    title: Free
    description: Start using RocketSim as an individual developer and explore the Simulator workflow improvements.
    price_prefix: "€"
    features:
      - enable: true
        included: false
        feature: Pro access to RocketSim
      - enable: true
        included: false
        feature: Team build insights
      - enable: true
        included: false
        feature: User management
      - enable: true
        included: false
        feature: License management
    price:
      yearly:
        amount: 0
        period: "/ month"
    microcopy: "Free forever — no account needed"
    cta:
      enable: true
      label: Download now
      site: custom
      link: "https://apps.apple.com/app/apple-store/id1504940162?pt=117264678&ct=pricing-table-free&mt=8"
      class: "plausible-event-name=App+Store+Install plausible-event-surface=landing plausible-event-placement=landing-pricing-free plausible-event-format=button"
  - enable: true
    title: Personal
    description: For individual developers who want Pro features through the App Store, billed at your local App Store price.
    price_prefix: ""
    features:
      - enable: true
        included: true
        feature: Pro access to RocketSim
      - enable: true
        included: false
        feature: Team build insights
      - enable: true
        included: false
        feature: User management
      - enable: true
        included: false
        feature: License management
    price:
      yearly:
        amount: "In-app"
        period: ""
        note: "App Store price per country"
    microcopy: "Upgrade in-app when Pro saves you time"
    cta:
      enable: true
      label: Download now
      site: custom
      link: "https://apps.apple.com/app/apple-store/id1504940162?pt=117264678&ct=pricing-table-personal&mt=8"
      class: "plausible-event-name=App+Store+Install plausible-event-surface=landing plausible-event-placement=landing-pricing-personal plausible-event-format=button"
  - enable: true
    title: Teams
    description: For companies that need shared seats, centralized billing, license management, and team build insights.
    price_prefix: "€"
    features:
      - enable: true
        included: true
        feature: Pro access to RocketSim
      - enable: true
        included: true
        feature: Team build insights
      - enable: true
        included: true
        feature: User management
      - enable: true
        included: true
        feature: License management
      - enable: true
        included: false
        feature: "Local-only Build Insights mode (Enterprise)"
    price:
      yearly:
        amount: 10
        period: "/ seat / month"
        note: "€120 billed annually"
    microcopy: "Commercial licensing with a 14-day trial"
    cta:
      enable: true
      label: Start 14-day Trial
      site: teams
      link: "/signup/trial?utm_source=website&utm_medium=website&utm_content=pricing"
      class: "plausible-event-name=CTA:+Pricing+Teams+-+Trial"
  - enable: true
    title: Enterprise
    description: For larger organizations that need more control, security, custom distribution, and rollout support.
    price_prefix: ""
    features:
      - enable: true
        included: true
        feature: "Everything in Teams"
      - enable: true
        included: true
        feature: SAML based SSO
      - enable: true
        included: true
        feature: Distribution outside of the App Store
      - enable: true
        included: true
        feature: Group based user management
      - enable: true
        included: true
        feature: "Local-only Build Insights mode controlled from the Teams portal"
    price:
      yearly:
        amount: "Custom"
        period: ""
    microcopy: "Custom pricing for 20+ seats"
    cta:
      enable: true
      label: Contact sales
      site: custom
      link: "mailto:ralphduin@rocketsim.app"
      class: "plausible-event-name=CTA:+Pricing+Enterprise+-+Contact"
---
