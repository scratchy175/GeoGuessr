import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request) {

    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/signup'
    //local :  const token = request.cookies.get('next-auth.session-token')?.value || '' 
    // prduction :   const token = request.cookies.get('__Secure-next-auth.session-token')?.value || '' 
    const token = request.cookies.get('next-auth.session-token')?.value || '' 

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', request.nextUrl))
    }

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
     
        '/login',
        '/signup',

    ],
}