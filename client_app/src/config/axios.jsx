import axios from "axios";
//user
export const authInstance = axios.create({
  baseURL: "/api/user",
});

export const chatInstance = axios.create({
  baseURL: "/api/chat",
});
export const messageInstance = axios.create({
  baseURL: "/api/message",
  headers: {
    "Content-Type": "application/json",
  },
});
