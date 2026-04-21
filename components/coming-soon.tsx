import { WarningIcon } from "./icons";

export function ComingSoon({ label }: { label: string }) {
  return (
    <div className="bg-modal-surface rounded-[9px] p-8 flex flex-col items-center justify-center gap-3 min-h-48">
      <div className="w-10 h-10 rounded-full bg-modal-icon-bg flex items-center justify-center text-modal-muted">
        <WarningIcon className="w-5 h-5 shrink-0" />
      </div>
      <p className="text-modal-muted text-sm font-bold capitalize">
        {label} — Coming Soon
      </p>
      <p className="text-modal-muted text-xs text-center leading-relaxed max-w-48">
        This feature is under development and will be available shortly.
      </p>
    </div>
  );
}
