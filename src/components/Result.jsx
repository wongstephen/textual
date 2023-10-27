import React from "react";
import "./Result.css";
import userIco from "../assets/user-regular.svg";
import compoterIco from "../assets/computer-solid.svg";
const Result = ({ results }) => {
  return (
    <div>
      {results.map((result, idx) => {
        return (
          <section className="result" key={idx}>
            <div className="prompt">
              <div>
                <img src={userIco} className="svg--userIcon" alt="user" />
              </div>
              <p className="div__prompt__text">{result.prompt}</p>
            </div>
            <div className="response">
              <div>
                <img
                  src={compoterIco}
                  alt="computer icon"
                  className="svg--computerIcon"
                ></img>
              </div>
              <div>
                <p className="result__text">{result.res}</p>
                <p className="result__info-text">
                  Total tokens used: {result.tokens} & Total cost: $
                  {(result.tokens / 1000) * 0.002}
                </p>
     
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Result;
