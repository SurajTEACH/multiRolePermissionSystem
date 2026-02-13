import api from "../../lib/api.js";

export async function listRolesApi() {
  const res = await api.get("/api/roles");
  return res.data.roles;
}

export async function getRoleApi(roleId) {
  const res = await api.get(`/api/roles/${roleId}`); // Option A
  return res.data.role; // {id,name,description,permissions[]...}
}

export async function createRoleApi(payload) {
  const res = await api.post("/api/roles", payload);
  return res.data.role;
}

export async function updateRoleApi(roleId, payload) {
  const res = await api.put(`/api/roles/${roleId}`, payload);
  return res.data.role;
}

export async function deleteRoleApi(roleId) {
  const res = await api.delete(`/api/roles/${roleId}`);
  return res.data;
}
