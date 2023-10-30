import "./App.css";
import { useRef, useState } from "react";
import { OpenAI } from "openai";
import Result from "./Result";
import EnvelopeIcon from "./Elements/EnvelopeIcon";

const gptEngine = import.meta.env.VITE_GPT_ENGINE;

function App() {
  const textRef = useRef("");
  const [results, setResults] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [textareaRows, setTextareaRows] = useState(1);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleChange = () => {
    const currentTextRows = (textRef.current.value?.length / 110 + 1) | 1;
    const currentManualRows = textRef.current.value.split("\n").length;
    const currentRows = Math.max(currentTextRows, currentManualRows);
    setTextareaRows(Math.min(currentRows, 8));

    if (isDisabled && textRef.current.value.length > 0) {
      setIsDisabled(() => false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(isDisabled);

    try {
      if (!textRef.current.value) {
        throw new Error("No text entered");
      }

      setIsDisabled(() => true);

      const response = await openai.chat.completions.create({
        model: gptEngine,
        messages: [{ role: "user", content: textRef.current.value }],
        temperature: 1,
        max_tokens: 2600,
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

  // const textareaRows = Math.floor(textRef.current.value?.length / 110) + 1 || 1;

  return (
    <div className="app">
      <header className="header">
        <div className="header__title-wrapper">
          <h1 className="header__title">Using version {gptEngine}</h1>
        </div>
      </header>

      <main className="main">
        <Result results={results} />
      </main>

      <section className="input-section">
        <div className="input-section__form-wrapper">
          <form className="input-section__form" onSubmit={handleSubmit}>
            <textarea
              ref={textRef}
              className="input-section__form__textarea"
              rows={textareaRows}
              onChange={handleChange}
              placeholder="Enter your message here..."
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className={`input-section__form__button ${
                isDisabled ? "input-section__form__button--disabled" : ""
              }`}
              disabled={isDisabled}
            >
              <EnvelopeIcon className="input-section__form__button__icon" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;
