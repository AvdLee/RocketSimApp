# Teams funnel analytics

Plausible event names are part of the site's historical reporting contract. Do
not rename an existing event when its destination or copy changes. Add a new
event only when tracking a genuinely new action.

## Existing Teams events

- `CTA: Homepage Insights - Learn More` opens `/for-teams`.
- `CTA: Homepage Mid 2 - Trial` opens `/for-teams`. The historical name says
  "Trial," but the action only opens Teams information. Keep the event name and
  describe it as a Teams information click in Plausible.
- `CTA: Team Page - See Pricing` opens `/pricing/`.
- `CTA: Team Page - Start Trial` opens the Teams trial form from the hero or
  bottom call-to-action.
- `CTA: Team Page - Proof Start Trial` opens the Teams trial form from the proof
  section.
- `CTA: Pricing Teams - Trial` opens the Teams trial form from the pricing
  comparison.
- `CTA: Pricing Teams - Buy Now` opens the direct Teams checkout.
- `CTA: Pricing Bottom - Trial` opens the Teams trial form from the pricing
  page's bottom call-to-action.
- `CTA: Blog Bottom - Trial` opens the Teams trial form from a blog post's
  bottom call-to-action.

## Trial completion

Configure `/signup/trial/thank-you/` as a Plausible pageview goal. The page is
the successful trial-creation destination, so using its existing pageviews
preserves historical data without introducing another custom event.

The goal is directional until `www.rocketsim.app` and `teams.rocketsim.app`
have been verified to use the same Plausible site ID and script.
