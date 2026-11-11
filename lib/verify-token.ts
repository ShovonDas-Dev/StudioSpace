import { jwtVerify, createRemoteJWKSet, type JWTPayload } from "jose";

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

const JWKS = createRemoteJWKSet(new URL("/api/auth/jwks", baseURL));

export async function verifyToken(request: Request): Promise<JWTPayload | null> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(authHeader.slice(7), JWKS, {
      issuer: baseURL,
      audience: baseURL,
    });

    return payload;
  } catch {
    return null;
  }
}
