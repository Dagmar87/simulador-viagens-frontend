import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error(
    "A variável VITE_API_BASE_URL não está configurada no .env.local."
  );
}

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});