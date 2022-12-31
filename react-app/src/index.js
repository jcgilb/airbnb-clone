import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store";
import { Provider } from "react-redux";
import { ModalProvider } from "./context/Modal";
import App from "./App";
import "./index.css";
import LatestReviewProvider from "./context/LatestReviewContext";

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ModalProvider>
        <LatestReviewProvider>
          <App />
        </LatestReviewProvider>
      </ModalProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
