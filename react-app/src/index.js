import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store";
import { Provider } from "react-redux";
import { ModalProvider } from "./context/Modal";
import App from "./App";
import "./index.css";
import SearchResultsProvider from "./context/SearchResultsContext";
import SubmittedProvider from "./context/SubmittedContext";

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider>
        <SearchResultsProvider>
          <SubmittedProvider>
            <App />
          </SubmittedProvider>
        </SearchResultsProvider>
      </ModalProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
