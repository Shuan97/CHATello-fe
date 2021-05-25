import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export const pushHistoryAsync = (path, delay = 0) => {
  setTimeout(() => {
    history.push(path);
  }, delay);
};

export default history;
