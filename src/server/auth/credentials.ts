import { cookies } from "next/headers";

export const WEREAD_API_KEY_COOKIE = "weread_api_key";

export async function getWeReadApiKey(): Promise<string | null> {
  const fromEnv = process.env.WEREAD_API_KEY?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  const cookieStore = await cookies();
  const fromCookie = cookieStore.get(WEREAD_API_KEY_COOKIE)?.value?.trim();
  return fromCookie || null;
}
