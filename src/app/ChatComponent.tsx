"use client";

import { marked } from "marked";
import Image from "next/image";
import { FormEventHandler, useState } from "react";

import { Button } from "@/components/Button";
import ThreeDots from "@/components/ThreeDots";
import text from "@/locales/en.json";
import { type ChatResponse, fetchOpenAIResponse } from "@/utils/api";
import cn from "@/utils/cn";

import styles from "./ChatComponent.module.css";
import common from "./common.module.css";

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

    const res = await fetchOpenAIResponse([
      ...conversationHistory.slice(-3).flat(1),
      { role: "user", content: prompt },
    ]);

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

  function handleCopyToClipboard(prompt: string): void {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(prompt).catch(() => {});
    }
  }
  return (
    <div className={cn([styles.container])}>
      <h3>{text.title}</h3>
      <Image
        src="/main-title.png"
        alt="Textual Logo"
        width={300}
        height={300}
        className={cn([styles.titleImage])}
        priority
      />

      <div className={styles.chatResponse}>
        {conversationHistory.map(([user, assistant], index) => (
          <div key={index} className={styles.chatItem}>
            <p className={styles.resTitle}>{text.prompt}</p>
            <p className={styles['user-prompt']} onClick={() => handleCopyToClipboard(user.content)}>
              {user.content}
            </p>
            <p className={styles.resTitle}>{text.answer}</p>

            {assistant.content ? (
              <p
                className={cn([common["text-body"]])}
                dangerouslySetInnerHTML={{ __html: marked(assistant.content) }}
              />
            ) : (
              <ThreeDots className={cn([styles.throbber])} />
            )}
          </div>
        ))}
      </div>

      {conversationHistory.length > 0 && (
        <Button
          onClick={handleClearHistory}
          className={cn([styles.clearButton])}
        >
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
            placeholder={text.promptPlaceholder}
            onChange={(e) => setPrompt(e.target.value)}
            minLength={1}
          />
        </div>
        <Button type="submit">{loading ? text.loading : text.send}</Button>
      </form>
    </div>
  );
}
