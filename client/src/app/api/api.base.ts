import { Api } from "@/lib/api/Api";

export const api = new Api({
  baseUrl: process.env.API_BASE_URL ?? "http://localhost:5281",
});
