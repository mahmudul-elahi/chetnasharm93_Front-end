export const ensureAuthRedirect = (redirectTo?: string) => {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

  // Check cookies as well
  const hasCookie = document.cookie.includes("authToken=");

  if (!token && !hasCookie) {
    const redirect = redirectTo || window.location.pathname;
    window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
    return false;
  }
  return true;
};
