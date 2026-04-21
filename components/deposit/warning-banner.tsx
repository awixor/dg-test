import { WarningIcon } from "@/components/icons";

interface WarningBannerProps {
  children: React.ReactNode;
}

export function WarningBanner({ children }: WarningBannerProps) {
  return (
    <div className="flex gap-3 bg-warning-gold rounded-md p-2 w-full items-center">
      <WarningIcon className="shrink-0 text-warning-text" />
      <p className="text-sm text-warning-text leading-snug">{children}</p>
    </div>
  );
}
