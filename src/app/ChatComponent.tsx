"use client";

import { FormEventHandler, useState } from "react";
import { marked } from "marked";
import text from "@/locales/en.json";
import cn from "@/utils/cn";
import { fetchOpenAIResponse } from "@/utils/api";
import ThreeDots from "@/components/ThreeDots";
import { Button } from "@/components/Button";
import styles from "./ChatComponent.module.css";

export default function ChatComponent() {
  const [response, setResponse] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleClearHistory = () => {
    setResponse([]);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setResponse((prev) => [...prev, [prompt, ""]]);
    setLoading(true);

    const body = await fetchOpenAIResponse(prompt);

    if (!body) {
      setLoading(false);
      return;
    }

    const reader = body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value, { stream: !doneReading });
      setResponse((prev) => [
        ...prev.slice(0, -1),
        [prompt, prev[prev.length - 1][1] + chunkValue],
      ]);
    }

    setLoading(false);
  };

  return (
    <div className={cn([styles.container])}>
      <h3>{text.title}</h3>

      <div className={cn([styles.chatResponse])}>
        {response.map(([prompt, answer], index) => (
          <div key={index} className={styles.chatItem}>
            <p className={cn([styles.resTitle])}>{text.prompt}</p>
            <p>{prompt}</p>
            <p className={cn([styles.resTitle])}>{text.answer}</p>

            {answer ? (
              <p dangerouslySetInnerHTML={{ __html: marked(answer) }} />
            ) : (
              <ThreeDots className={cn([styles.throbber])} />
            )}
          </div>
        ))}
      </div>

      {response.length > 0 && (
        <Button
          onClick={handleClearHistory}
          className={cn([styles.clearButton])}
        >
          {text.clearHistory}
        </Button>
      )}

      <form onSubmit={handleSubmit} className={cn([styles.chatForm])}>
        <textarea
          value={prompt}
          placeholder="Ask me something..."
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">{loading ? "Loading..." : "Send"}</button>
      </form>
    </div>
  );
}
