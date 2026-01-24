// Lightweight JWT payload decoder without dependencies
// Decodes the payload (middle part) of a JWT
const decodeJwtPayload = (token) => {
  try {
    const parts = String(token).split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(base64);
    return JSON.parse(json);
  } catch (_) {
    return null;
  }
};

// Extract token from either path param or query (?t=...)
export const getTokenFromLocation = () => {
  try {
    const url = new URL(window.location.href);
    const queryToken = url.searchParams.get("t");
    // Path token: last segment of pathname
    const segments = url.pathname.split("/").filter(Boolean);
    const pathToken = segments.length ? segments[segments.length - 1] : null;
    return queryToken || pathToken || null;
  } catch (_) {
    return null;
  }
};

// React hook to read and decode share token
export const useShareToken = () => {
  const rawToken = getTokenFromLocation();
  const token = rawToken ? decodeURIComponent(rawToken) : null;
  const payload = token ? decodeJwtPayload(token) : null;

  debugger;

  const expMs = payload?.exp ? payload.exp * 1000 : null;
  const isExpired = expMs ? Date.now() > expMs : false;

  // sid may also be provided as query param; prefer payload then query
  let sid = payload?.sid ?? null;
  try {
    const url = new URL(window.location.href);
    sid = sid ?? url.searchParams.get("sid");
  } catch (_) {}

  return {
    token, // full JWT string
    payload, // decoded payload object or null
    sid: sid ? Number(sid) : null,
    isExpired,
  };
};

export default useShareToken;
