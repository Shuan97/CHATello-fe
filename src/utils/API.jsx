import axios from "axios";

export default axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "https://192.168.0.178:3200/api/v1"
      : "https://chatello.herokuapp.com/api/v1",
  // baseURL: "https://chatello.herokuapp.com/api/v1",
  withCredentials: true,
  // headers: {
  //   Authorization: () => {
  //     return `Bearer ${localStorage.getItem("token")}`;
  //   },
  // },
});
