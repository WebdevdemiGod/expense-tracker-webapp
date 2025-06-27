import type { Transaction } from './types';

interface SummaryWidgetProps {
  transactions: Transaction[];
}

export const SummaryWidget = ({ transactions }: SummaryWidgetProps) => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Summary</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Income:</span>
          <span className="font-medium text-green-600">${totalIncome.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Total Expenses:</span>
          <span className="font-medium text-red-600">${totalExpenses.toFixed(2)}</span>
        </div>
        
        <div className="pt-2 border-t border-gray-200 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Balance:</span>
            <span className={balance >= 0 ? 'text-green-600' : 'text-red-600'}>
              ${Math.abs(balance).toFixed(2)}
              {balance < 0 ? ' (Over budget)' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryWidget;