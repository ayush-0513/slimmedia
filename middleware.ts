import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';


const isPublicRoute = createRouteMatcher([
    "/sign-in",
    "/sign-up",
    "/",
    "/home",
])

const isPublicApiRoute = createRouteMatcher([
    "/api/videos",

])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth(); // await is needed or not.
    const currentUrl = new URL(req.url)
    const isAccessingDashboard = currentUrl.pathname === '/home'
    const isApiRequest = currentUrl.pathname.startsWith('/api')

    if(userId && isPublicRoute(req) && !isAccessingDashboard) {
      return NextResponse.redirect(new URL('/home', req.url))
    }
    //not logged in
    if (!userId){
      // If the user is not logged in, redirect them to sign-in
       if(!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL('/sign-in', req.url))
    }
       // If the user is not logged in and accessing an API route, redirect to sign-in
    if(isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL('/signin', req.url))
    }
  }
  return NextResponse.next()
//without this u canot have moddleware

})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)","/","/(api|trpc)(.*)"],

};