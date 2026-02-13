import React from "react";
import "./Loader.css";

const Loader = ({
  type = "spinner", // spinner | dots | fullscreen
  size = "md",      // sm | md | lg
  text,
}) => {

  const sizeClass = `spinner-${size}`;

  if (type === "fullscreen") {
    return (
      <div className="loader-fullscreen">
        <div className={`spinner ${sizeClass}`}></div>
        {text && <p className="loader-text">{text}</p>}
      </div>
    );
  }

  if (type === "dots") {
    return (
      <div className="loader-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }

  return (
    <div className="loader-inline">
      <div className={`spinner ${sizeClass}`}></div>
      {text && <span className="loader-text">{text}</span>}
    </div>
  );
};

export default Loader;
