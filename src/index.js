import React from "react";
import { render } from "react-dom";
import App from "./components/app";
import Editor from "./components/editor";
import { BrowserRouter, Routes, Route } from "react-router-dom";

render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="edit/:id/:width/:height" element={<Editor />} />
      <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
      />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
