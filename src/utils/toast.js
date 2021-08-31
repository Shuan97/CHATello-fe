import { toast } from "react-toastify";

export const showToast = (message, type = "info") => {
  switch (type) {
    case "info":
      return toast.info(`${message}! 🐱`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    default:
      return;
  }
};
