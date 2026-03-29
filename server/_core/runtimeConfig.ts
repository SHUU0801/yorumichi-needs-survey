type RuntimeConfig = {
  appId: string;
  oauthPortalUrl: string;
};

export function getRuntimeConfig(): RuntimeConfig {
  return {
    appId: process.env.VITE_APP_ID ?? "",
    oauthPortalUrl: process.env.VITE_OAUTH_PORTAL_URL ?? "",
  };
}

export function renderRuntimeConfigScript() {
  const config = JSON.stringify(getRuntimeConfig());
  return `window.__APP_CONFIG__ = ${config};`;
}
