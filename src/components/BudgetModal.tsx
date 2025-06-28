import React, { useState, useEffect } from 'react';
import { useBudget, type Budget, type BudgetInput } from '../hooks/useBudget';

const ConfirmationDialog: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}> = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', cancelText = 'Cancel', isDangerous = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDangerous 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget?: Budget | null;
  onSuccess?: () => void;
}

export const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  onSuccess,
}) => {
  const { addBudget, deleteBudget, loading, error } = useBudget();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Form state
  const [amount, setAmount] = useState('');
  const [periodType, setPeriodType] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form when modal opens or currentBudget changes
  useEffect(() => {
    if (isOpen) {
      if (currentBudget) {
        // Editing existing budget
        setAmount(currentBudget.amount.toString());
        setPeriodType(currentBudget.period_type);
        setStartDate(currentBudget.start_date);
        setEndDate(currentBudget.end_date);
        setIsEditing(true);
      } else {
        // Creating new budget - set defaults
        resetForm();
        setDefaultDates();
        setIsEditing(false);
      }
    }
  }, [isOpen, currentBudget]);

  const resetForm = () => {
    setAmount('');
    setPeriodType('monthly');
    setStartDate('');
    setEndDate('');
    setFormError(null);
  };

  const setDefaultDates = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1); // 
    let end: Date;

    switch (periodType) {
      case 'weekly':
        end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'yearly':
        end = new Date(start.getFullYear() + 1, start.getMonth(), 0); 
        break;
      case 'monthly':
      default:
        end = new Date(start.getFullYear(), start.getMonth() + 1, 0); 
        break;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  useEffect(() => {
    if (startDate && !currentBudget) {
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
  }, [periodType, startDate, currentBudget]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const budgetData: BudgetInput = {
        user_id: '', 
        amount: parseFloat(amount),
        period_type: periodType,
        start_date: startDate,
        end_date: endDate,
      };

      console.log('Submitting budget data:', budgetData);
      
      // The addBudget function now handles both create and update
      await addBudget(budgetData);
      
      console.log(isEditing ? 'Budget updated successfully' : 'Budget created successfully');
      onClose();
      onSuccess?.();
      
    } catch (err) {
      console.error('Error submitting budget:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to save budget');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!currentBudget?.id) return;
    
    try {
      setIsDeleting(true);
      setShowDeleteConfirm(false);
      console.log('Deleting budget with ID:', currentBudget.id);
      await deleteBudget(Number(currentBudget.id));
      console.log('Budget deleted successfully');
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('Error deleting budget:', err);
      setFormError('Failed to delete budget');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit Budget' : 'Set Budget'}
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
            {isEditing && (
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={loading || isDeleting}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete Budget'
                )}
              </button>
            )}
            <ConfirmationDialog
              isOpen={showDeleteConfirm}
              title="Delete Budget"
              message="Are you sure you want to delete this budget? This action cannot be undone."
              confirmText="Delete Budget"
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
              isDangerous={true}
            />
            <button
              type="submit"
              disabled={loading || isDeleting}
              className={`${isEditing ? 'flex-1' : 'w-full'} bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Set Budget'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </>
  );
};