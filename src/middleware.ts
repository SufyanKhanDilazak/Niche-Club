import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);

const ADMIN_EMAILS = [
  "vaneezakhan2010@gmail.com",
  "dkhurram278@gmail.com",
  "iamhuzaifa8@gmail.com",
  "alihassaan.work@gmail.com"
];

export default clerkMiddleware(async (auth, req) => {
  // Public routes
  const publicRoutes = [
    /^\/$/,
    /^\/sign-in(\/.*)?$/,
    /^\/sign-up(\/.*)?$/,
    /^\/api(\/.*)?$/,
    /^\/unauthorized$/,
    /^\/products(\/.*)?$/,
    /^\/cart$/,
    /^\/checkout$/,
  ];

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => 
    route.test(req.nextUrl.pathname)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // Handle protected routes
  if (isDashboardRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirectUrl", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Admin check for dashboard
    try {
      const { clerkClient } = await import("@clerk/nextjs/server");
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const userEmail = user.emailAddresses[0]?.emailAddress;

      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};