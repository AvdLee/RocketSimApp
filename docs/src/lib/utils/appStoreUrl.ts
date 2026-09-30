// The RocketSim App Store link. `campaign` becomes `ct=`, which App Store
// Connect reports per campaign, so each placement keeps its own value.
export const appStoreUrl = (campaign: string) =>
  `https://apps.apple.com/app/apple-store/id1504940162?pt=117264678&ct=${encodeURIComponent(campaign)}&mt=8`;
