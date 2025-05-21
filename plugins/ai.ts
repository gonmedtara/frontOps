export default defineNuxtPlugin(() => {
  const callAI = async ({
    systemPrompt,
    userPrompt,
    model = "gpt-3.5-turbo",
  }: {
    systemPrompt: string;
    userPrompt: string;
    model?: string;
  }) => {
    const res = await $fetch("/api/ai", {
      method: "POST",
      body: { systemPrompt, userPrompt, model },
    });
    return res;
  };

  return {
    provide: { callAI },
  };
});
