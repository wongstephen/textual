import "./App.css";
import { useRef, useState } from "react";
import { OpenAI } from "openai";
import Result from "./Result";

function App() {
  const textRef = useRef("");
  const [results, setResults] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsDisabled(() => true);
    try {
      if (!textRef.current.value) return;
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: textRef.current.value }],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log(response);
      setResults((prev) => {
        return [
          ...prev,
          {
            prompt: textRef.current.value,
            res: response.choices[0].message.content,
            tokens: response.usage.total_tokens,
          },
        ];
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsDisabled(() => false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="h1">ChatGPT 4</h1>
      </header>
      <main className="main">
        <Result results={results} />
      </main>
      <div className="footer">
        <form onSubmit={handleSubmit}>
          <textarea ref={textRef} className="form__textarea" />
          <br />
          <button
            onClick={handleSubmit}
            className="form__button"
            disabled={isDisabled}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
