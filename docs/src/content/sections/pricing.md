---
title: "Choose a pricing plan best suited <em>for you</em>"

plans:
  - enable: true
    title: Free
    description: Explore how our 30+ Xcode Simulator features can increase your productivity
    price_prefix: "€"
    color: "#1d1d1f"
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
    cta:
      enable: true
      label: Download now
      site: custom
      link: "https://apps.apple.com/app/apple-store/id1504940162?pt=117264678&ct=pricing-table-free&mt=8"
      class: "plausible-event-name=App+Store+Install+Free"
  - enable: true
    title: Personal
    description: Ideal for solo developers—enjoy every Pro feature with an in-app purchase
    price_prefix: "€"
    color: "#1d1d1f"
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
        amount: 5
        period: "/ month"
    cta:
      enable: true
      label: Download now
      site: custom
      link: "https://apps.apple.com/app/apple-store/id1504940162?pt=117264678&ct=pricing-table-personal&mt=8"
      class: "plausible-event-name=App+Store+Install+Personal"
  - enable: true
    title: Teams
    description: Perfect for teams with multiple developers
    price_prefix: "€"
    color: "#1d1d1f"
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
    price:
      yearly:
        amount: 10
        period: "/ seat / month"
        note: "€120 billed annually"
    cta:
      enable: true
      label: Start 14-day Trial
      site: teams
      link: "/signup/trial"
  - enable: false
    title: Enterprise
    description: For larger enterprise with a need for more control and security
    price_prefix: "€"
    color: "#1d1d1f"
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
    price:
      yearly:
        amount: 15
        period: "/ seat / month"
        note: "€180 billed annually"
    cta:
      enable: true
      label: Contact sales
      site: custom
      link: "mailto:ralphduin@rocketsim.app"
---
