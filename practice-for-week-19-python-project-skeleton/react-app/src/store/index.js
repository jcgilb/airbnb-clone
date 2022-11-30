import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import session from "./session";
import bookingReducer from "./bookings";
import experienceReducer from "./experiences";
import timeSlotReducer from "./timeSlots";
import imageReducer from "./images";

const rootReducer = combineReducers({
  session,
  experiences: experienceReducer,
  bookings: bookingReducer,
  times: timeSlotReducer,
  images: imageReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
