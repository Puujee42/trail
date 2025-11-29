import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",                  // Add this: Make root public
  "/sign-in(.*)",       // Covers /sign-in and subpaths
  "/sign-up(.*)",       // Covers /sign-up and subpaths
  "/sso-callback(.*)"   // For OAuth callbacks
  // Add more public routes here if needed, e.g., "/about(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();  // Only protect non-public routes
  }
}, {
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up"
  // debug: true  // Uncomment for console logs during testing
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};