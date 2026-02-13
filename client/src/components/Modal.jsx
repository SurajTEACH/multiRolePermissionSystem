import { useEffect } from "react";

export default function Modal({ open, title, onClose, children, footer }) {
  // ESC close
  useEffect(() => {
    function onEsc(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  // Lock background scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />

      {/* Wrapper */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Card: mobile = bottom sheet, desktop = centered dialog */}
        <div
          className="
            w-full
            sm:max-w-3xl
            bg-white ring-1 ring-slate-200 shadow-xl
            rounded-t-2xl sm:rounded-xl
            h-[92dvh] sm:h-auto
            max-h-[92dvh] sm:max-h-[92dvh]
            flex flex-col
            animate-[modalIn_.16s_ease-out]
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold">{title}</h3>
            </div>

            <button
              onClick={onClose}
              className="shrink-0 rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Body (scroll area) */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer ? (
            <div className="border-t border-slate-200 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                {footer}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Tiny animation keyframes */}
      <style>{`
        @keyframes modalIn {
          from { transform: translateY(14px); opacity: 0.6; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
