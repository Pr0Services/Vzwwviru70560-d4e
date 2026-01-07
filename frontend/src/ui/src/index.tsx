/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — ENTRY POINT
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Global styles
const globalStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body, #root {
    height: 100%;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F5F5F5;
    color: #1E1F22;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #F0F0F0;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #CCC;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #AAA;
  }
  
  button {
    font-family: inherit;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  a {
    color: #3F7249;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
`;

// Inject global styles
const styleElement = document.createElement("style");
styleElement.textContent = globalStyles;
document.head.appendChild(styleElement);

// Mount application
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  logger.error("CHE·NU: Root container not found");
}
