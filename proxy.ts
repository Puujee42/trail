     import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

     const isPublicRoute = createRouteMatcher([
       "/",                  // Root is public
       "/about(.*)",        // Covers /about and subpaths,
       "/contact(.*)",      // Covers /contact and subpaths,
       "/blog(.*)",         // Covers /blog and subpaths,
       "/packages(.*)",     // Covers /packages and subpaths,
       "/tour(.*)", 
       "/sign-in",       // Covers /sign-in and subpaths
       "/sign-up(.*)",       // Covers /sign-up and subpaths
       "/sso-callback(.*)",  // For OAuth callbacksx
       "/packages/europe(.*)",
       "/packages/mongolia(.*)",   // Public video file  
        "/api/comments(.*)", // Public comments API
       // Add more public routes here if needed, e.g., "/about(.*)"
       // Note: Static files like /hero.mp4 are handled by the matcher below, so no need to list them here
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
         // Updated: Added mp4, webm, ogg for video files
         "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|ogg)).*)",
         // Always run for API routes
         "/(api|trpc)(.*)",
       ],
     };
     