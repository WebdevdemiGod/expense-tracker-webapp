import { TotalBalance } from '../components/totalBalance';
import TotalExpense from '../components/totalExpense';
import ExpenseBreakdown from '../components/expenseBreakdown';
import MonthlyOverview from '../components/monthlyOverview';
import RecentTransactions from '../components/recentTransaction';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-F0FAF8 p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 md:gap-6 mb-6">
        <div className="h-full w-full">
          <TotalBalance totalExpenses={0} totalIncome={0} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        <div className="h-full">
          <ExpenseBreakdown />
        </div>
        <div className="h-full">
          <MonthlyOverview />
        </div>
      </div>
      
      <div className="mb-6">
        <RecentTransactions />
      </div>
    </div>
  );
}
