import OpenAI from "openai";

const GPT_MODEL = "gpt-4.1";

const openAiConfig = {
  apiKey: process.env.OPENAI_API_KEY,
};

export async function POST(request: Request) {
  const { conversation_history } = await request.json();

  const client = new OpenAI(openAiConfig);

  const stream = await client.chat.completions.create({
    model: GPT_MODEL,
    messages: conversation_history,
    temperature: 0.7,
    stream: true,
  });

  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          console.log(chunk);
          const text = chunk.choices[0].delta?.content || "";
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    }),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
