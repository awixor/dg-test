export function DepositModalSkeleton() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-95.5 bg-modal-bg border border-modal-border rounded-[9px] overflow-hidden animate-pulse">
        <div className="flex flex-col gap-4 px-3 pt-3 pb-6">
          <div className="flex justify-end">
            <div className="w-6 h-6 rounded-md bg-modal-icon-bg" />
          </div>

          <div className="bg-modal-dark rounded-md p-1 flex gap-1 h-9.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 rounded-[3px] bg-modal-bg" />
            ))}
          </div>

          <div className="bg-modal-surface rounded-[9px] p-3">
            <div className="h-4 w-24 bg-modal-icon-bg rounded mb-2" />
            <div className="h-9 w-full bg-modal-bg rounded-md" />
          </div>

          <div className="bg-modal-surface rounded-[9px] p-3">
            <div className="h-4 w-28 bg-modal-icon-bg rounded mb-2" />
            <div className="h-9 w-full bg-modal-bg rounded-md" />
          </div>

          <div className="bg-modal-surface rounded-[9px] p-3 flex flex-col gap-4 items-center">
            <div className="h-10 w-full bg-warning-gold rounded-md opacity-50" />

            <div className="w-30 h-30 bg-modal-icon-bg rounded-md" />

            <div className="w-full flex flex-col gap-1">
              <div className="h-3 w-16 bg-modal-icon-bg rounded" />
              <div className="h-4 w-full bg-modal-icon-bg rounded" />
            </div>

            <div className="h-9 w-full bg-accent-purple rounded-[9px] opacity-50" />

            <div className="w-full flex flex-col gap-1">
              <div className="h-3 w-16 bg-modal-icon-bg rounded" />
              <div className="h-4 w-24 bg-modal-icon-bg rounded" />
            </div>

            <div className="space-y-1 w-full">
              <div className="h-4 w-full bg-modal-icon-bg rounded" />
              <div className="h-4 w-2/3 bg-modal-icon-bg rounded" />
            </div>

            <div className="h-4 w-32 bg-modal-icon-bg rounded" />
          </div>

          <div className="flex justify-center">
            <div className="h-4 w-4 bg-modal-icon-bg rounded" />
          </div>

          <div className="bg-modal-dark rounded-[9px] p-3 flex flex-col gap-3">
            <div className="h-9 w-full bg-modal-bg rounded-[9px]" />

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-6 h-6 bg-modal-bg rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
