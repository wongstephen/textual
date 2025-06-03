export async function fetchOpenAIResponse(prompt: string): Promise<Response> {
  const res = await fetch("/api/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    console.error("Error fetching OpenAI response:", res.statusText);
    console.error("Response body:", res.body);
    console.error("Response status:", res.status);
  }

  return res;
}
