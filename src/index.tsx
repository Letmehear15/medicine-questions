import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "./theme";
import { QuestionProvider } from "./context/QuestionProvider";
import { RedirectProvider } from "./context/RedirectProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />

    <RedirectProvider>
      {/* <QuestionProvider> */}
      <App />
      {/* </QuestionProvider> */}
    </RedirectProvider>
  </ThemeProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
