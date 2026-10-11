export const AI_CONFIG = {
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL,
  groqBaseUrl: "https://api.groq.com/openai/v1",
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
};
