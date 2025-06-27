import React from 'react';
import { useBudget } from '../hooks/useBudget';

interface TotalBalanceProps {
  totalExpenses: number;
  totalIncome: number;
}

export const TotalBalance: React.FC<TotalBalanceProps> = ({
  totalExpenses,
  totalIncome,
}) => {
  const { budgets, getCurrentBudget, getBudgetUtilization, loading, error } = useBudget();
  
  // Get current active budget
  const currentBudget = getCurrentBudget();
  
  // Calculate budget utilization if we have a current budget
  const budgetUtilization = currentBudget 
    ? getBudgetUtilization(currentBudget, totalExpenses)
    : null;

  // Calculate available balance
  const availableBalance = totalIncome - totalExpenses;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Financial Overview</h2>
      
      {/* Main Balance Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Income */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Income</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-700">
                {formatCurrency(totalExpenses)}
              </p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Available Balance */}
        <div className={`${availableBalance >= 0 ? 'bg-blue-50' : 'bg-orange-50'} rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${availableBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                Available Balance
              </p>
              <p className={`text-2xl font-bold ${availableBalance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                {formatCurrency(availableBalance)}
              </p>
            </div>
            <div className={`w-10 h-10 ${availableBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} rounded-full flex items-center justify-center`}>
              <svg className={`w-5 h-5 ${availableBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Information */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Budget Status</h3>
        
        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading budget...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-600 text-sm">Error loading budget: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {currentBudget && budgetUtilization ? (
              <div className="space-y-4">
                {/* Budget Overview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Current Budget ({currentBudget.period_type})
                      </h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(currentBudget.start_date)} - {formatDate(currentBudget.end_date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-800">
                        {formatCurrency(currentBudget.amount)}
                      </p>
                      <p className="text-sm text-gray-600">Total Budget</p>
                    </div>
                  </div>

                  {/* Budget Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Spent: {formatCurrency(totalExpenses)}</span>
                      <span>{budgetUtilization.utilization.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          budgetUtilization.isOverBudget
                            ? 'bg-red-500'
                            : budgetUtilization.utilization > 80
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(budgetUtilization.utilization, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Budget Status */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`text-sm font-medium ${
                        budgetUtilization.isOverBudget
                          ? 'text-red-600'
                          : budgetUtilization.remaining > 0
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}>
                        {budgetUtilization.isOverBudget
                          ? `Over budget by ${formatCurrency(Math.abs(budgetUtilization.remaining))}`
                          : budgetUtilization.remaining > 0
                          ? `${formatCurrency(budgetUtilization.remaining)} remaining`
                          : 'Budget fully utilized'
                        }
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      budgetUtilization.isOverBudget
                        ? 'bg-red-100 text-red-800'
                        : budgetUtilization.utilization > 80
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {budgetUtilization.isOverBudget
                        ? 'Over Budget'
                        : budgetUtilization.utilization > 80
                        ? 'Near Limit'
                        : 'On Track'
                      }
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-600 font-medium mb-1">No Active Budget</p>
                <p className="text-sm text-gray-500">Set up a budget to track your spending</p>
              </div>
            )}

            {/* Budget Summary */}
            {budgets.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Total budgets: {budgets.length}
                  {budgets.length > 1 && currentBudget && (
                    <span className="ml-2 text-blue-600">
                      (1 active)
                    </span>
                  )}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};