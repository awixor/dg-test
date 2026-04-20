import { Suspense } from "react";
import { DepositModal } from "@/components/deposit-modal";
import { DepositModalSkeleton } from "@/components/deposit-modal-skeleton";

export default function Home() {
  return (
    <Suspense fallback={<DepositModalSkeleton />}>
      <DepositModal />
    </Suspense>
  );
}
