import { NextResponse } from "next/server";

import { requireRole } from "@/lib/authz";

export async function GET(request: Request) {
  const result = await requireRole(request, "admin");

  if (!result.ok) {
    return result.response;
  }

  return NextResponse.json({
    message: "Admin access granted",
    user: {
      id: result.auth.userId,
      email: result.auth.email,
      role: result.auth.role,
    },
  });
}
