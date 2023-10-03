import React from "react";

const Result = ({ results }) => {
  return (
    <div>
      <p className="result__title">WorkGpt</p>
      {results.map((result, idx) => {
        return (
          <div className="result__container" key={idx}>
            <div className="result__prompt">
              <p className="result__text">{result.prompt}</p>
            </div>
            <div className="result__response">
              <p className="result__text">{result.res}</p>
              <p className="result__info-text">
                Total tokens used: {result.tokens} & Total cost: $
                {(result.tokens / 1000) * 0.002}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Result;
