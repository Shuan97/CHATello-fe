import { combineReducers, configureStore } from "@reduxjs/toolkit";
import articlesReducer from "features/articlesSlice";
import categoriesReducer from "features/categoriesSlice";
import channelsReducer from "features/channelsSlice";
import messagesReducer from "features/messagesSlice";
import setsReducer from "features/setsSlice";
import userReducer from "features/userSlice";
import { createLogger } from "redux-logger";
import ReduxThunk from "redux-thunk";
import API from "utils/API";
import immutableStateInvariantMiddleware from "redux-immutable-state-invariant";

/**
 * Create custom thunk middleware and pass axios API instance
 */
const thunk = ReduxThunk.withExtraArgument({ API });

const immutableStateInvariant = immutableStateInvariantMiddleware();

// export const reset = "\x1b[0m"
// export const bright = "\x1b[1m"
// export const dim = "\x1b[2m"
// export const underscore = "\x1b[4m"
// export const blink = "\x1b[5m"
// export const reverse = "\x1b[7m"
// export const hidden = "\x1b[8m"

// export const black = "\x1b[30m"
// export const red = "\x1b[31m"
// export const green = "\x1b[32m"
// export const yellow = "\x1b[33m"
// export const blue = "\x1b[34m"
// export const magenta = "\x1b[35m"
// export const cyan = "\x1b[36m"
// export const white = "\x1b[37m"

// export const BGblack = "\x1b[40m"
// export const BGred = "\x1b[41m"
// export const BGgreen = "\x1b[42m"
// export const BGyellow = "\x1b[43m"
// export const BGblue = "\x1b[44m"
// export const BGmagenta = "\x1b[45m"
// export const BGcyan = "\x1b[46m"
// export const BGwhite = "\x1b[47m"

/**
 * Create custom logger with new colors
 *
 * Learn more - https://misc.flogisoft.com/bash/tip_colors_and_formatting
 */
const logger = createLogger({
  collapsed: true,
  colors: {
    title: (action) => {
      if (!action) {
        console.warn("Action not defined - [dispatch] has missing action");
        return null;
      }
      const { type } = action;
      if (type.indexOf("pending") > -1) return "#FFAA32";
      if (type.indexOf("fulfilled") > -1) return "#00ee32";
      if (type.indexOf("rejected") > -1) return "#ff3232";
      if (type.indexOf("update") > -1) return "#11bcff";
      // console.log(
      //   `%c[Logger]%c Action type %c[${type}] %cnot recognized in custom logger.`,
      //   "color: #00eeff",
      //   "color: #bbc900",
      //   "color: #22aa00",
      //   "color: #bbc900"
      // );
      // console.log(
      //   `\x1b[36m[Logger]\x1b[39m Action type \x1b[33m[${type}]\x1b[39m not recognized in custom logger.`
      // );
      return "#22bbff";
    },
  },
});

/**
 * Combine reducers used in store
 */
const reducer = combineReducers({
  user: userReducer,
  channels: channelsReducer,
  messages: messagesReducer,
  categories: categoriesReducer,
  articles: articlesReducer,
  sets: setsReducer,
});

const middleware = [];

if (process.env.NODE_ENV !== "production") {
  middleware.push(immutableStateInvariant, thunk, logger);
} else {
  middleware.push(thunk, logger);
}

/**
 * Configure store, pass reducer object and middleware array
 */
const store = configureStore({
  reducer: reducer,
  middleware: middleware,
});

export default store;
