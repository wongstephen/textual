"use client";

import { FormEventHandler, useState } from "react";
import styles from "./ChatComponent.module.css";
import { marked } from "marked";
import { fetchOpenAIResponse } from "@/utils/api";
import text from "@/locales/en.json";
import ThreeDots from "@/components/ThreeDots";

export default function ChatComponent() {
  const [response, setResponse] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setResponse((prev) => [...prev, [prompt, ""]]);
    setLoading(true);

    const res = await fetchOpenAIResponse(prompt);

    if (!res.ok || !res.body) {
      const errorMessage = `Error ${res.status} ${res.statusText}, please try again later.`;
      setResponse((prev) => [...prev.slice(0, -1), [prompt, errorMessage]]);
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
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
    <div>
      <h3>{text.title}</h3>

      <div className={styles.chatResponse}>
        {response.map(([prompt, answer], index) => (
          <div key={index} className={styles.chatItem}>
            <p className={styles.resTitle}>{text.prompt}</p>
            <p>{prompt}</p>
            <p className={styles.resTitle}>{text.answer}</p>

            {answer ? (
              <p dangerouslySetInnerHTML={{ __html: marked(answer) }} />
            ) : (
              <ThreeDots className={styles.throbber} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.chatForm}>
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
