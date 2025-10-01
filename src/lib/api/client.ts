import ky from "ky";

export const api = ky.create({
  prefixUrl: "/api",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
});
