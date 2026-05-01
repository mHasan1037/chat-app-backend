import { AI_CONFIG } from "../config/ai";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OllamaResponse = {
  message: {
    content: string;
  };
};

const ollamaProvider = async (
  messages: ChatMessage[]
): Promise<string> => {
  const res = await fetch(`${AI_CONFIG.ollamaBaseUrl}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen3:14b",
      messages,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama request failed: ${res.status} ${res.statusText}`);
  }

  const data: OllamaResponse = await res.json();
  return data.message.content;
};

export default ollamaProvider;