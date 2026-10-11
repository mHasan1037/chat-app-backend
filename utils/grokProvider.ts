import { AI_CONFIG } from "../config/ai";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type GroqResponse = {
  choices: { message: { content: string } }[];
};

const groqProvider = async (messages: ChatMessage[]): Promise<string> => {
  if (!AI_CONFIG.groqApiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const res = await fetch(`${AI_CONFIG.groqBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_CONFIG.groqApiKey}`,
    },
    body: JSON.stringify({
      model: AI_CONFIG.groqModel,
      messages,
      stream: false,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq request failed: ${res.status} ${errText}`);
  }

  const data: GroqResponse = await res.json();
  return data.choices[0]?.message?.content ?? "";
};

export default groqProvider;