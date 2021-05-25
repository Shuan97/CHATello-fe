import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export const pushHistoryAsync = (path, delay = 0) => {
  setTimeout(() => {
    if (path === "/login" && history.location.pathname !== "/login") {
      history.push(historyLink(path));
    } else {
      history.push({
        pathname: path,
        state: null,
      });
    }
  }, delay);
};

export const historyLink = (path) => {
  return {
    pathname: path,
    state: { from: history.location },
  };
};

export default history;
