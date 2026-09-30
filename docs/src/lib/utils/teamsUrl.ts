import config from "@/config/config.json";

// Base URL of the Teams app (LicenseKit): production in production builds,
// and the local LicenseKit server otherwise, so the Teams flows can be tested
// without touching production.
export const teamsUrl =
  import.meta.env.MODE === "production"
    ? config.site.teams_base_url
    : "http://localhost:5173";

// The hosted Teams trial form. `content` becomes `utm_content`, telling the
// Teams app which call to action sent the visitor.
export const teamsTrialUrl = (content: string) =>
  `${teamsUrl}/signup/trial?utm_source=website&utm_medium=website&utm_content=${content}`;
