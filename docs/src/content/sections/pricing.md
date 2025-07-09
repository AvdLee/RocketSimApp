---
title: "Choose a pricing plan best suited <em>for you</em>"

plans:
  - enable: true
    title: Trial
    description: Keen to try it out first? Sign up for a free two weeks trial. 
    price_prefix: ''
    color: "#FEECA0" # TODO: change color
    features:
      - enable: true
        included: true
        feature: Pro access to RocketSim.
      - enable: true
        included: true
        feature: Team build insights.
      - enable: true
        included: true
        feature: User management.
      - enable: true
        included: true
        feature: License management.
    price:
      yearly:
        amount: FREE
        period: ''
    cta:
      enable: true
      label: Sign up for a free trial
      site: teams
      link: "/signup/trial"
  - enable: true
    title: Individual
    description: Perfect for solo developers.
    price_prefix: "€"
    color: "#C9DEFD" # TODO: change color
    features:
      - enable: true
        included: true
        feature: Pro access to RocketSim.
      - enable: true
        included: false
        feature: Team build insights.
      - enable: true
        included: false
        feature: User management.
      - enable: true
        included: false
        feature: License management.
    price:
      yearly:
        amount: 50
        period: per year
    cta:
      enable: true
      label: Download now
      site: custom
      link: "https://apps.apple.com/app/apple-store/id1504940162?pt=117264678&ct=website-header&mt=8"
      class: "plausible-event-name=App+Store+Install"
  - enable: true
    title: Teams
    description: Perfect for teams with multiple developers.
    price_prefix: "€"
    color: "#EFEAFE" # TODO: change color
    features:
      - enable: true
        included: true
        feature: Pro access to RocketSim.
      - enable: true
        included: true
        feature: Team build insights.
      - enable: true
        included: true
        feature: User management.
      - enable: true
        included: true
        feature: License management.
    price:
      yearly:
        amount: 120
        period: 'per year'
    cta:
      enable: true
      label: Subscribe
      site: custom
      link: "/contact" # TODO: link to Stripe
  - enable: false
    title: Enterprise
    description: For larger enterprises with complex requirements.
    price_prefix: ""
    color: "#C9DEFD" # TODO: change color
    features:
      - enable: true
        included: true
        feature: "Everything in Teams, and:"
      - enable: true
        included: true
        feature: SAML based SSO.
      - enable: true
        included: true
        feature: Distribution outside of the App Store.
      - enable: true
        included: true
        feature: Group based user management.
    price:
      yearly:
        amount: COMING SOON
        period: ''
    cta:
      enable: true
      label: Contact sales
      site: custom
      link: "mailto:ralphduin@rocketsim.app"
---