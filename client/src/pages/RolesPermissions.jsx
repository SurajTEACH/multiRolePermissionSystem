import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import Can from "../components/Can.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useAuth } from "../features/auth/AuthProvider.jsx";

import RoleCard from "../features/roles/RoleCard.jsx";
import RoleUpsertModal from "../features/roles/RoleUpsertModal.jsx";
import { deleteRoleApi, listRolesApi } from "../features/roles/rolesApi.js";
import api from "../lib/api.js";

function Topbar({ onAdd, user }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold">Roles & Permissions</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage user roles and their access permissions
        </p>
      </div>

      <Can permission="system.manage" user={user}>
        <button
          onClick={onAdd}
          className="
            w-full sm:w-auto
            rounded-md bg-blue-600 px-3 py-2
            text-sm font-medium text-white hover:bg-blue-700
          "
        >
          + Add Role
        </button>
      </Can>
    </div>
  );
}

function Tabs({ tab, setTab, rolesCount, permsCount }) {
  const tabs = useMemo(
    () => [
      { key: "roles", label: `Roles (${rolesCount})` },
      { key: "permissions", label: `Permissions (${permsCount})` }
    ],
    [rolesCount, permsCount]
  );

  return (
    <div className="mt-6 border-b border-slate-200">
      {/* Mobile friendly: allow horizontal scroll if needed */}
      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              "whitespace-nowrap pb-3 text-sm font-medium " +
              (tab === t.key
                ? "border-b-2 border-blue-600 text-blue-700"
                : "text-slate-600 hover:text-slate-900")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function RolesPermissions() {
  const { user, logout } = useAuth();

  const [tab, setTab] = useState("roles");

  const [upsertOpen, setUpsertOpen] = useState(false);
  const [editRoleId, setEditRoleId] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteRole, setDeleteRole] = useState(null);

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: listRolesApi
  });

  const permsQuery = useQuery({
    queryKey: ["permissionGroups"],
    queryFn: async () => {
      const res = await api.get("/api/permissions");
      return res.data.groups;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (roleId) => deleteRoleApi(roleId),
    onSuccess: () => rolesQuery.refetch()
  });

  const roles = rolesQuery.data || [];
  const permissionCount =
    (permsQuery.data || []).reduce((sum, g) => sum + (g.items?.length || 0), 0);

  function openCreate() {
    setEditRoleId(null);
    setUpsertOpen(true);
  }

  function openEdit(role) {
    setEditRoleId(role.id);
    setUpsertOpen(true);
  }

  function openDelete(role) {
    setDeleteRole(role);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!deleteRole?.id) return;
    await deleteMutation.mutateAsync(deleteRole.id);
    setConfirmOpen(false);
    setDeleteRole(null);
  }

  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4 py-6 sm:py-8">
      {/* Header row (responsive) */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-600">
          <span className="hidden sm:inline">Signed in as</span>
          <span className="max-w-[70vw] truncate font-medium text-slate-900 sm:max-w-none">
            {user?.email || "-"}
          </span>

          <button
            onClick={logout}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>

      <Topbar onAdd={openCreate} user={user} />

      <Tabs
        tab={tab}
        setTab={setTab}
        rolesCount={roles.length}
        permsCount={permissionCount}
      />

      {/* Content */}
      {tab === "roles" ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rolesQuery.isLoading ? (
            <div className="text-sm text-slate-600">Loading roles...</div>
          ) : rolesQuery.isError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {rolesQuery.error?.response?.data?.message || "Failed to load roles"}
            </div>
          ) : roles.length === 0 ? (
            <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              No roles found.
            </div>
          ) : (
            roles.map((r) => (
              <Can
                key={r.id}
                permission="system.manage"
                user={user}
                fallback={<RoleCard role={r} />}
              >
                <RoleCard role={r} onEdit={openEdit} onDelete={openDelete} />
              </Can>
            ))
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {permsQuery.isLoading ? (
            <div className="text-sm text-slate-600">Loading permissions...</div>
          ) : permsQuery.isError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {permsQuery.error?.response?.data?.message || "Failed to load permissions"}
            </div>
          ) : (
            (permsQuery.data || []).map((g) => (
              <div
                key={g.group}
                className="rounded-xl bg-white shadow-card ring-1 ring-slate-200"
              >
                <div className="border-b border-slate-200 px-4 sm:px-5 py-3 text-sm font-semibold">
                  {g.group}
                </div>

                {/* responsive grid for permission list */}
                <div className="grid grid-cols-1 gap-2 px-4 sm:px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(g.items || []).map((p) => (
                    <div key={p.key} className="text-xs text-slate-700">
                      <span className="font-medium">{p.label}</span>
                      <div className="break-all text-[11px] text-slate-500">
                        {p.key}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <Can permission="system.manage" user={user}>
        <RoleUpsertModal
          open={upsertOpen}
          roleId={editRoleId}
          onClose={() => setUpsertOpen(false)}
          onSaved={() => rolesQuery.refetch()}
        />

        <ConfirmDialog
          open={confirmOpen}
          title="Delete role"
          description={
            deleteRole?.isSystem
              ? "System roles cannot be deleted."
              : `This will permanently delete "${deleteRole?.name}". Continue?`
          }
          confirmText={deleteRole?.isSystem ? "Close" : "Delete"}
          onClose={() => setConfirmOpen(false)}
          onConfirm={deleteRole?.isSystem ? () => setConfirmOpen(false) : confirmDelete}
          danger={!deleteRole?.isSystem}
        />
      </Can>
    </div>
  );
}
