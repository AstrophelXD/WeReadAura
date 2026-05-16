import type { WeReadGateway } from "@/server/adapters/weread/gateway";
import { SkillWeReadGateway } from "@/server/adapters/weread/skill-gateway";

const skillGateway = new SkillWeReadGateway();

export function isValidWeReadApiKey(apiKey: string | null | undefined): apiKey is string {
  return Boolean(apiKey && apiKey.startsWith("wrk-"));
}

export function getWeReadGateway(apiKey: string | null | undefined): WeReadGateway | null {
  if (!isValidWeReadApiKey(apiKey)) {
    return null;
  }
  return skillGateway;
}

export function createGatewayContext(apiKey: string): { apiKey: string } {
  return { apiKey };
}
