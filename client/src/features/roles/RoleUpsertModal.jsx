import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import Modal from "../../components/Modal.jsx";
import api from "../../lib/api.js";
import { createRoleApi, getRoleApi, updateRoleApi } from "./rolesApi.js";

function Section({ title, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-2">
        <div className="text-xs font-semibold text-slate-700">{title}</div>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

function Checkbox({ label, ...rest }) {
  return (
    <label className="flex items-start gap-2 text-slate-700">
      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0" {...rest} />
      <span className="text-xs leading-5 break-words">{label}</span>
    </label>
  );
}

export default function RoleUpsertModal({ open, onClose, onSaved, roleId }) {
  const isEdit = !!roleId;

  // Permission groups
  const permsQuery = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const res = await api.get("/api/permissions");
      return res.data.groups;
    },
    enabled: open
  });

  const groups = permsQuery.data || [];
  const allKeys = useMemo(
    () => groups.flatMap((g) => (g.items || []).map((i) => i.key)),
    [groups]
  );

  // Option A: Fetch role detail for edit (full permissions[])
  const roleQuery = useQuery({
    queryKey: ["role", roleId],
    queryFn: () => getRoleApi(roleId),
    enabled: open && isEdit
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      permissions: []
    }
  });

  // preload values
  useEffect(() => {
    if (!open) return;

    if (!isEdit) {
      reset({ name: "", description: "", permissions: [] });
      return;
    }

    if (roleQuery.data) {
      reset({
        name: roleQuery.data.name || "",
        description: roleQuery.data.description || "",
        permissions: roleQuery.data.permissions || []
      });
    }
  }, [open, isEdit, roleQuery.data, reset]);

  const selected = watch("permissions") || [];

  const createMutation = useMutation({ mutationFn: createRoleApi });
  const updateMutation = useMutation({
    mutationFn: (payload) => updateRoleApi(roleId, payload)
  });

  function toggleAll(checked) {
    setValue("permissions", checked ? allKeys : []);
  }

  const onSubmit = async (values) => {
    const payload = {
      name: values.name,
      description: values.description,
      permissions: values.permissions || []
    };

    if (isEdit) await updateMutation.mutateAsync(payload);
    else await createMutation.mutateAsync(payload);

    reset();
    onSaved?.();
    onClose?.();
  };

  const busy =
    isSubmitting ||
    permsQuery.isLoading ||
    roleQuery.isLoading ||
    createMutation.isPending ||
    updateMutation.isPending;

  const errorMsg =
    permsQuery.error?.response?.data?.message ||
    roleQuery.error?.response?.data?.message ||
    createMutation.error?.response?.data?.message ||
    updateMutation.error?.response?.data?.message;

  return (
    <Modal
      open={open}
      title={isEdit ? "Edit Role" : "Add New Role"}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-md border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={busy}
            className="w-full sm:w-auto rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {busy ? "Saving..." : isEdit ? "Save Changes" : "Create Role"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Top fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-700">Role Name</label>
            <input
              {...register("name", { required: true })}
              placeholder="Enter role name"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700">Description</label>
            <input
              {...register("description")}
              placeholder="Enter role description"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>

        {/* Select all bar (wrap-friendly) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2">
          <div className="text-xs text-slate-700">
            Permissions{" "}
            <span className="ml-2 text-slate-500">({selected.length} selected)</span>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700">
            <input
              type="checkbox"
              checked={selected.length === allKeys.length && allKeys.length > 0}
              onChange={(e) => toggleAll(e.target.checked)}
            />
            Select all
          </label>
        </div>

        {/* Permission sections */}
        <div className="space-y-3">
          {groups.map((g) => (
            <Section key={g.group} title={g.group}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {(g.items || []).map((p) => (
                  <Checkbox
                    key={p.key}
                    label={p.label}
                    value={p.key}
                    {...register("permissions")}
                  />
                ))}
              </div>
            </Section>
          ))}
        </div>

        {/* Errors */}
        {errorMsg ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMsg || "Something went wrong"}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
