import { WEREAD_GATEWAY_URL, WEREAD_SKILL_VERSION } from "@/server/adapters/weread/constants";
import { WeReadApiError } from "@/server/adapters/weread/errors";

type GatewayPayload = Record<string, unknown> & {
  errcode?: number;
  errmsg?: string;
  upgrade_info?: { message?: string };
};

export async function callWeReadGateway<T extends GatewayPayload>(
  apiKey: string,
  body: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(WEREAD_GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body,
      skill_version: WEREAD_SKILL_VERSION,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new WeReadApiError({
      errcode: response.status,
      errmsg: `WeRead gateway HTTP ${response.status}`,
    });
  }

  const payload = (await response.json()) as T;

  if (payload.upgrade_info) {
    throw new WeReadApiError(payload);
  }

  if (typeof payload.errcode === "number" && payload.errcode !== 0) {
    throw new WeReadApiError(payload);
  }

  return payload;
}
