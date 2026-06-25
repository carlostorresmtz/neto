import { auth } from "@/auth";
import { NextResponse } from "next/server";

const PROTECTED_PATHS = [
  "/chat",
  "/estados",
  "/gastos",
  "/analisis",
  "/suscripciones",
  "/alertas",
  "/conexiones",
  "/cuentas",
  "/agentes",
];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p));

  if (isProtected && !req.auth) {
    const connectUrl = new URL("/conectar", req.nextUrl);
    return NextResponse.redirect(connectUrl);
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|api/auth|api/agentes|api/chat|api/waitlist).*)",
  ],
};
