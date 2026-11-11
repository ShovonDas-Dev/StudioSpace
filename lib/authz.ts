import { NextResponse } from "next/server";

import { db } from "./auth";
import { verifyToken } from "./verify-token";

export type Role = "admin" | "user";

export type AuthContext = {
  userId: string;
  email: string;
  role: Role;
};

type AuthSuccess = { ok: true; auth: AuthContext };
type AuthFailure = { ok: false; response: NextResponse };
export type AuthResult = AuthSuccess | AuthFailure;

export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export function forbiddenResponse(): NextResponse {
  return NextResponse.json({ message: "Forbidden" }, { status: 403 });
}

export async function requireAuth(request: Request): Promise<AuthResult> {
  const payload = await verifyToken(request);

  if (
    !payload ||
    typeof payload.id !== "string" ||
    typeof payload.email !== "string"
  ) {
    return { ok: false, response: unauthorizedResponse() };
  }

  const dbUser = await db.collection("user").findOne(
    { email: payload.email },
    { projection: { role: 1 } }
  );

  if (!dbUser) {
    return { ok: false, response: unauthorizedResponse() };
  }

  const role: Role = dbUser.role === "admin" ? "admin" : "user";

  return {
    ok: true,
    auth: { userId: payload.id, email: payload.email, role },
  };
}

export async function requireRole(
  request: Request,
  ...allowedRoles: Role[]
): Promise<AuthResult> {
  const result = await requireAuth(request);

  if (!result.ok) {
    return result;
  }

  if (!allowedRoles.includes(result.auth.role)) {
    return { ok: false, response: forbiddenResponse() };
  }

  return result;
}

export function ownsEmail(auth: AuthContext, bookingEmail: string): boolean {
  return (
    auth.role === "admin" ||
    bookingEmail.trim().toLowerCase() === auth.email.toLowerCase()
  );
}
