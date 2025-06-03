"use client";

import { FormEventHandler, useState } from "react";
import styles from "./ChatComponent.module.css";
import { marked } from "marked";
import { fetchOpenAIResponse } from "@/utils/api";
import text from "@/locales/en.json";
import ThreeDots from "@/components/ThreeDots";
import { Button } from "@/components/Button";
import Image from "next/image";

type ChatResponse = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatComponent() {
  const [conversationHistory, setConversationHistory] = useState<
    [ChatResponse, ChatResponse][]
  >([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const handleClearHistory = () => {
    setConversationHistory([]);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setConversationHistory((prev) => [
      ...prev,
      [
        { role: "user", content: prompt },
        { role: "assistant", content: "" },
      ],
    ]);
    setLoading(true);

    const res = await fetchOpenAIResponse(prompt);

    if (!res.ok || !res.body) {
      const errorMessage = `Error ${res.status} ${res.statusText}, please try again later.`;
      setConversationHistory((prev) => [
        ...prev.slice(0, -1),
        [
          { role: "user", content: prompt },
          { role: "assistant", content: errorMessage },
        ],
      ]);
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
      setConversationHistory((prev) => [
        ...prev.slice(0, -1),
        [
          { role: "user", content: prompt },
          {
            role: "assistant",
            content: prev[prev.length - 1][1].content + chunkValue,
          },
        ],
      ]);
    }

    setPrompt("");
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h3>{text.title}</h3>
      <Image
        src="/main-title.png"
        alt="Textual Logo"
        width={300}
        height={300}
        className={styles.titleImage}
        priority
      />

      <div className={styles.chatResponse}>
        {conversationHistory.map(([user, assistant], index) => (
          <div key={index} className={styles.chatItem}>
            <p className={styles.resTitle}>{text.prompt}</p>
            <p>{user.content}</p>
            <p className={styles.resTitle}>{text.answer}</p>

            {assistant.content ? (
              <p
                dangerouslySetInnerHTML={{ __html: marked(assistant.content) }}
              />
            ) : (
              <ThreeDots className={styles.throbber} />
            )}
          </div>
        ))}
      </div>

      {conversationHistory.length > 0 && (
        <Button onClick={handleClearHistory} className={styles.clearButton}>
          {text.clearHistory}
        </Button>
      )}

      <form onSubmit={handleSubmit} className={styles.chatForm}>
        <div className={styles.formGroup}>
          <label htmlFor="prompt" className="sr-only">
            {text.prompt}
          </label>
          <textarea
            required
            value={prompt}
            placeholder={text.prompt}
            onChange={(e) => setPrompt(e.target.value)}
            minLength={1}
          />
        </div>
        <Button type="submit">{loading ? text.loading : text.send}</Button>
      </form>
    </div>
  );
}
