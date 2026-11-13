/**
 * Personal Pro prices in the US App Store.
 *
 * App Store prices differ per country, so the site only states the US price
 * explicitly, for readers and AI assistants that need a concrete number. Read
 * from App Store Connect on 2026-11-13 (monthly and yearly subscriptions, no
 * upcoming price changes). Update these values, and the matching sentences in
 * `src/content/sections/faq.md` and `src/content/sections/pricing.md`, when
 * the US price changes.
 */
export const personalProUsPrices = {
  currency: "USD",
  monthly: "9.99",
  yearly: "69.99",
  checkedOn: "2026-11-13",
} as const;

/** The same prices as written in copy, for example `$9.99 per month`. */
export const personalProUsPriceCopy = {
  monthly: `$${personalProUsPrices.monthly} per month`,
  yearly: `$${personalProUsPrices.yearly} per year`,
} as const;
