import { AI_AGENTS } from "../utils/aiAgents";

export const callAI = async (agentType: string, context: any) => {
  const agent = AI_AGENTS[agentType as keyof typeof AI_AGENTS];
  if (!agent) {
    throw new Error(`Unknown agent type: ${agentType}`);
  }

  const config = useRuntimeConfig();
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: agent.content,
        },
        {
          role: "user",
          content: agent.getPrompt(context),
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "No response";
};

