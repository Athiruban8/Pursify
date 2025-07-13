import { Suspense } from "react";
import { getUserAccounts } from "@/actions/dashboard";
import { getDashboardData } from "@/actions/dashboard";
import { getCurrentBudget } from "@/actions/budget";
import { getAllTransactions } from "@/actions/transaction";
import { getAllAccounts } from "@/actions/account";
import { AccountCard } from "./_components/account-card";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { BudgetProgress } from "./_components/budget-progress";
import { TransactionChart } from "../transaction/_components/transaction-chart";
import { DashboardOverview } from "./_components/transaction-overview";
import { AccountSelector } from "./_components/account-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { BarLoader } from "react-spinners";

export default async function DashboardPage() {
  const [accounts, transactions, allTransactions, allAccounts] = await Promise.all([
    getUserAccounts(),
    getDashboardData(),
    getAllTransactions(),
    getAllAccounts(),
  ]);

  const defaultAccount = accounts?.find((account) => account.isDefault);

  // Get budget for default account
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }

  return (
    <div className="space-y-8 px-2 sm:px-5">
      {/* Account Selector */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountSelector accounts={accounts} />
      </Suspense>

      {/* Accounts Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {accounts.length > 0 &&
          accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <Plus className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
      </div>

      {/* Budget Progress */}
      <BudgetProgress
        initialBudget={budgetData?.budget}
        currentExpenses={budgetData?.currentExpenses || 0}
      />

      {/* Transaction Charts - Split into smaller cards */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionChart transactions={allTransactions} accounts={allAccounts} />
      </Suspense>

      {/* Dashboard Overview */}
      <DashboardOverview
        accounts={accounts}
        transactions={transactions || []}
      />
    </div>
  );
}
