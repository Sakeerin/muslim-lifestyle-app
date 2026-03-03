import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname === "/admin/login";
  const isAdmin =
    request.auth?.user?.role === "ADMIN" ||
    (Boolean(process.env.ADMIN_EMAIL) && request.auth?.user?.email === process.env.ADMIN_EMAIL);

  if (isLoginRoute && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isLoginRoute) {
    return NextResponse.next();
  }

  if (!isAdmin) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
