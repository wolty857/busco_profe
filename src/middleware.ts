import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Si es profesor sin perfil completado y no está en /completar-perfil
    if (
      token?.rol === "profesor" &&
      !token?.hasProfile &&
      pathname !== "/completar-perfil" &&
      !pathname.startsWith("/api/")
    ) {
      return NextResponse.redirect(new URL("/completar-perfil", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/completar-perfil", "/dashboard/:path*"],
};
