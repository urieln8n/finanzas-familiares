export default function FieldLabel({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-black uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}
