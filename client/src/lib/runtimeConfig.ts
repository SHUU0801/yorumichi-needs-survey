declare global {
  interface Window {
    __APP_CONFIG__?: {
      appId?: string;
      oauthPortalUrl?: string;
    };
  }
}

export function getRuntimeConfig() {
  return {
    appId: window.__APP_CONFIG__?.appId ?? import.meta.env.VITE_APP_ID ?? "",
    oauthPortalUrl:
      window.__APP_CONFIG__?.oauthPortalUrl ??
      import.meta.env.VITE_OAUTH_PORTAL_URL ??
      "",
  };
}
