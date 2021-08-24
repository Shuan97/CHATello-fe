import { isObject } from "lodash";

export const formatDate = (args) => {
  if (isObject(args)) {
    let { date } = args;
    return new Date(date).toLocaleString();
  }
  return new Date(args).toLocaleString();
};
