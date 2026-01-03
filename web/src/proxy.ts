// src/proxy.ts
export { auth as proxy } from "@/auth"

export const config = {
  // Garante que o proxy NÃO rode em /login e /register
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register).*)"],
}