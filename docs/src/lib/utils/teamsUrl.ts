import config from "@/config/config.json";

// Base URL of the Teams app (LicenseKit): production in production builds,
// and the local LicenseKit server otherwise, so the Teams flows can be tested
// without touching production.
export const teamsUrl =
  import.meta.env.MODE === "production"
    ? config.site.teams_base_url
    : "http://localhost:5173";
