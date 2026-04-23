import { Suspense } from "react";
import { DepositModal } from "@/components/deposit-modal";
import { DepositModalSkeleton } from "@/components/deposit-modal-skeleton";

export default async function Home() {
  return (
    <main>
      <h1 className="sr-only">Crypto Deposit Portal</h1>
      <Suspense fallback={<DepositModalSkeleton />}>
        <DepositModal />
      </Suspense>
    </main>
  );
}
