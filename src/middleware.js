import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(token); // Consider removing in production

    // Redirect logic
    if (req.nextUrl.pathname === "/user-auth" && token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (!token && req.nextUrl.pathname !== "/user-auth") {
      return NextResponse.redirect(new URL("/user-auth", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Error retrieving token:", error);
    return NextResponse.next(); // Proceed as normal in case of error
  }
}

export const config = {
  matcher: ["/", "/user-auth"],
};
