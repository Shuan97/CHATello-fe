import jwt from "jsonwebtoken";

export function isTokenExpired() {
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : null;

  if (!token) return true;

  const decoded = jwt.decode(token);

  if (!decoded?.exp) return true;

  const exp = decoded.exp;

  if (Date.now() >= exp * 1000) {
    return true;
  }
  return false;
}

export function getUserFromToken() {
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : null;

  const decoded = jwt.decode(token);
  return decoded;
}
