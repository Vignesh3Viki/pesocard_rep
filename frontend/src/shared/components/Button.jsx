import React from "react";
import "../../styles/global.css";

export function Button({
  children,
  onClick,
  type = "button",
  className = "",
  style = {},
}) {
  const defaultStyle = {
    padding: "10px 20px",
    backgroundColor: "var(--primary-color)",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
  };

  const combinedStyle = { ...defaultStyle, ...style };

  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      style={combinedStyle}
    >
      {children}
    </button>
  );
}
