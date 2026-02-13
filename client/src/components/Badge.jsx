import clsx from "clsx";

export default function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700 ring-slate-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200"
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone] || tones.neutral
      )}
    >
      {children}
    </span>
  );
}
