import api from "../../lib/api.js";

export async function loginApi(payload) {
  const res = await api.post("/api/auth/login", payload);
  return res.data; // { accessToken, user }
}

export async function meApi() {
  const res = await api.get("/api/auth/me");
  return res.data; // { success, user }
}
