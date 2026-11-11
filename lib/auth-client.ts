
import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URI as string,

  plugins: [jwtClient()],
});

export async function getJwtToken(): Promise<string | null> {
  const { data } = await authClient.token();
  return data?.token ?? null;
}
