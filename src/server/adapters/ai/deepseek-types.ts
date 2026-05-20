export type DeepSeekRole = "system" | "user" | "assistant" | "tool";

export interface DeepSeekToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface DeepSeekMessage {
  role: DeepSeekRole;
  content: string | null;
  tool_calls?: DeepSeekToolCall[];
  tool_call_id?: string;
  name?: string;
}

export interface DeepSeekToolDefinition {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface DeepSeekChatRequest {
  model: string;
  messages: DeepSeekMessage[];
  tools?: DeepSeekToolDefinition[];
  tool_choice?: "auto" | "none";
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface DeepSeekChatResponse {
  choices: {
    message: DeepSeekMessage;
    finish_reason: string;
  }[];
  error?: { message?: string };
}
