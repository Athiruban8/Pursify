export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { getAllTransactions } from "@/actions/transaction";
import { getAllAccounts } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "./_components/transaction-table";
import { TransactionFilters } from "./_components/transaction-filters";

export default async function TransactionsPage() {
  const [transactions, accounts] = await Promise.all([
    getAllTransactions(),
    getAllAccounts(),
  ]);

  return (
    <div className="space-y-8 px-2 sm:px-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 items-start sm:items-end justify-between">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight gradient-title">
            All Transactions
          </h1>
          <p className="text-muted-foreground">
            View and manage all your transactions across all accounts
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            {transactions.length} Transactions
          </div>
          <p className="text-sm text-muted-foreground">
            Across {accounts.length} accounts
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionFilters accounts={accounts} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionTable transactions={transactions} accounts={accounts} />
      </Suspense>
    </div>
  );
} 