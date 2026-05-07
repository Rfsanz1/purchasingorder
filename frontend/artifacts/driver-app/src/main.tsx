import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const splash = document.getElementById("initial-splash");
    if (splash) {
      splash.classList.add("is-leaving");
      setTimeout(() => splash.remove(), 300);
    }
  });
});
