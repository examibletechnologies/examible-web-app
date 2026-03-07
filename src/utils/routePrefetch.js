/**
 * Prefetch route chunks to load them in the background
 * Call this when hovering over links or on page load for anticipated routes
 */

// Map of route paths to their dynamic imports
const routePrefetches = {
  "/login": () => import("../auth/Login"),
  "/signup": () => import("../auth/SignUp"),
  "/dashboard": () => import("../pages/kenz/Dashboard"),
  "/overview": () => import("../pages/kenz/Overview"),
  "/mock-exam": () => import("../pages/kenz/Mockexam"),
  "/profile": () => import("../pages/kenz/Profile"),
  "/past-questions": () => import("../pages/jacob/PastQuestion"),
  "/subscription": () => import("../pages/jacob/Subscription"),
  "/make-payment": () => import("../pages/jacob/MakePayment"),
  "/about-us": () => import("../pages/jacob/AboutUs"),
  "/plans": () => import("../pages/jacob/Plans"),
};

/**
 * Prefetch a single route
 * @param {string} path - Route path to prefetch
 */
export function prefetchRoute(path) {
  if (routePrefetches[path]) {
    routePrefetches[path](); // Load in background
  }
}

/**
 * Prefetch multiple routes
 * @param {string[]} paths - Array of route paths to prefetch
 */
export function prefetchRoutes(paths) {
  paths.forEach((path) => prefetchRoute(path));
}

/**
 * Prefetch common routes on app load
 * Call this once when app initializes
 */
export function prefetchCommonRoutes() {
  // Prefetch routes users are likely to visit
  prefetchRoutes(["/login", "/signup", "/overview", "/mock-exam", "/profile"]);
}

export default { prefetchRoute, prefetchRoutes, prefetchCommonRoutes };
