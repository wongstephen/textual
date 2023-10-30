import React from "react";
import "./Result.css";
import { ChatBubble } from "./Elements/ChatBubble";
import { UserIcon } from "./Elements/UserIcon";

const Result = ({ results }) => {
  return (
    <section className="results">
      <div className="results-container">
        {results.map((result, idx) => {
          return (
            <div className="result" key={idx}>
              <div className="prompt">
                <div className="results__icon-wrapper">
                  <UserIcon className="results__icon results__icon-user" />
                </div>
                <p className="div__prompt__text">{result.prompt}</p>
              </div>
              <div className="response">
                <div className="results__icon-wrapper">
                  <ChatBubble className="results__icon results__icon-ai" />
                </div>
                <div>
                  <p className="result__text">{result.res}</p>
                  <p className="result__info-text">
                    Total tokens used: {result.tokens} & Total cost: $
                    {(result.tokens / 1000) * 0.002}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Result;
