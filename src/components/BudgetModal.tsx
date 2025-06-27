import React, { useState, useEffect } from 'react';
import { useBudget, type Budget, type BudgetInput } from '../hooks/useBudget';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget?: Budget | null;
  onSuccess?: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  budget = null,
  onSuccess,
}) => {
  const { addBudget, updateBudget, loading, error } = useBudget();
  
  // Form state
  const [amount, setAmount] = useState('');
  const [periodType, setPeriodType] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form when budget changes
  useEffect(() => {
    if (budget) {
      // Editing existing budget
      setAmount(budget.amount.toString());
      setPeriodType(budget.period_type);
      setStartDate(budget.start_date);
      setEndDate(budget.end_date);
    } else {
      // Creating new budget - set defaults
      resetForm();
      setDefaultDates();
    }
  }, [budget, isOpen]);

  // Reset form to defaults
  const resetForm = () => {
    setAmount('');
    setPeriodType('monthly');
    setStartDate('');
    setEndDate('');
    setFormError(null);
  };

  // Set default dates based on period type
  const setDefaultDates = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
    let end: Date;

    switch (periodType) {
      case 'weekly':
        end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'yearly':
        end = new Date(start.getFullYear() + 1, start.getMonth(), 0); // Last day of same month next year
        break;
      case 'monthly':
      default:
        end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // Last day of current month
        break;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  // Update end date when period type changes
  useEffect(() => {
    if (startDate && !budget) {
      const start = new Date(startDate);
      let end: Date;

      switch (periodType) {
        case 'weekly':
          end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
          break;
        case 'yearly':
          end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());
          break;
        case 'monthly':
        default:
          end = new Date(start.getFullYear(), start.getMonth() + 1, start.getDate());
          break;
      }

      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [periodType, startDate, budget]);

  // Validate form
  const validateForm = (): boolean => {
    setFormError(null);

    if (!amount || parseFloat(amount) <= 0) {
      setFormError('Please enter a valid amount greater than 0');
      return false;
    }

    if (!startDate || !endDate) {
      setFormError('Please select both start and end dates');
      return false;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setFormError('End date must be after start date');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const budgetData: BudgetInput = {
        user_id: '', // Will be overridden in the hook with authenticated user
        amount: parseFloat(amount),
        period_type: periodType,
        start_date: startDate,
        end_date: endDate,
      };

      console.log('Submitting budget data:', budgetData);

      if (budget) {
        // Update existing budget
        await updateBudget(budget.id, budgetData);
        console.log('Budget updated successfully');
      } else {
        // Create new budget
        await addBudget(budgetData);
        console.log('Budget created successfully');
      }

      // Success - close modal and notify parent
      onClose();
      onSuccess?.();
      
    } catch (err) {
      console.error('Error submitting budget:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to save budget');
    }
  };

  // Handle modal close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {budget ? 'Edit Budget' : 'Add Budget'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Budget Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter budget amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Period Type */}
          <div>
            <label htmlFor="periodType" className="block text-sm font-medium text-gray-700 mb-1">
              Period Type
            </label>
            <select
              id="periodType"
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as 'monthly' | 'weekly' | 'yearly')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Error Display */}
          {(formError || error) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">
                {formError || error}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : (budget ? 'Update' : 'Add')} Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};