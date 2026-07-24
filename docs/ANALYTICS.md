# Teams funnel analytics

Plausible event names are part of the site's historical reporting contract. Do
not rename an existing event when its destination or copy changes. Add a new
event only when tracking a genuinely new action.

## Existing Teams events

- `CTA: Homepage Hero - For Teams` opens `/for-teams/` from the homepage
  hero. This historical event was restored after the Teams link returned.
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

## Inline trial form events

- `Teams Trial Form Started` fires once when a visitor first interacts with the
  inline form on `/for-teams/`.
- `Teams Trial Signup Submitted` fires when the inline form is submitted.
- `CTA: Team Page - Start Trial` also fires on inline form submission to
  preserve the historical series.

These events include `surface`, `placement`, `format`, and `source`. Submission
events include a coarse `team_size` bucket. Never send names, email addresses,
or exact team sizes to Plausible.

## Trial completion

Configure `/signup/trial/thank-you/` as a Plausible pageview goal. The page is
the successful trial-creation destination, so using its existing pageviews
preserves historical data without introducing another custom event.

The goal is directional until `www.rocketsim.app` and `teams.rocketsim.app`
have been verified to use the same Plausible site ID and script.

## Paid conversion

`Teams Trial Converted` fires once per browser session when a successful Stripe
trial upgrade lands on the LicenseKit trial-upgrade success page. Configure it
as a Plausible custom-event goal and use unique visitors rather than raw events
for reporting.

## Four-week recovery measurement

Use the 30 completed days ending July 23, 2026 as the pre-change baseline:

- `/for-teams/`: 128 unique visitors.
- `Teams Trial Signup Completed`: 5 unique visitors.
- Homepage `App Store Install`: 14.23% conversion during the equal 32-day
  post-May-27 comparison period.

After four complete weeks, compare unique visitors and conversion rates against
an equal-length period:

1. Target at least 200 monthly-equivalent visitors to `/for-teams/`.
2. Target 12–18 monthly-equivalent unique completed trials.
3. Separate inline hero submissions from pricing CTA visitors using placement.
4. Report `Teams Trial Converted` as the final business outcome.
5. Treat homepage App Store install conversion as a guardrail. Investigate if
   it declines by more than 5% relative to the 14.23% baseline.
