import Badge from "../../components/Badge.jsx";
import { fmtDate } from "../../utils/format.js";

export default function RoleCard({ role, onEdit, onDelete }) {
  return (
    <div className="rounded-xl bg-white shadow-card ring-1 ring-slate-200">
      <div className="flex items-start justify-between p-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-slate-900">{role.name}</h4>
            {role.isSystem ? <Badge tone="blue">System</Badge> : null}
          </div>

          <p className="text-xs text-slate-600">{role.description || "—"}</p>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit?.(role)}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
            title="Edit role"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete?.(role)}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
            title="Delete role"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-slate-200 px-5 py-4 text-xs">
        <div>
          <div className="text-slate-500">Users</div>
          <div className="font-semibold text-slate-900">{role.usersCount ?? 0}</div>
        </div>
        <div>
          <div className="text-slate-500">Permissions</div>
          <div className="font-semibold text-slate-900">{role.permissionsCount ?? 0}</div>
        </div>
        <div>
          <div className="text-slate-500">Created</div>
          <div className="font-semibold text-slate-900">{fmtDate(role.createdAt)}</div>
        </div>
      </div>
    </div>
  );
}
