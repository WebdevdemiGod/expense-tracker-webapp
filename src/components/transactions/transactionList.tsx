import type { Transaction } from './types';
import { TransactionItem } from './transactionItem';
import { FiLoader } from 'react-icons/fi';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
  onSort: (field: 'date' | 'amount') => void;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const TransactionList = ({
  transactions,
  loading,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  className = ''
}: TransactionListProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handleSort = (field: 'date' | 'amount') => {
    onSort(field);
  };

  const SortIndicator = ({ field }: { field: 'date' | 'amount' }) => {
    if (sortBy !== field) return null;
    return (
      <span className="ml-1">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <FiLoader className="animate-spin h-8 w-8 text-green-500 mb-4" />
        <p className="text-gray-600">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200">
        <div className="col-span-5 font-medium text-gray-500">Description</div>
        <button
          className="col-span-2 font-medium text-gray-500 text-left flex items-center"
          onClick={() => handleSort('amount')}
        >
          Amount
          <SortIndicator field="amount" />
        </button>
        <div className="col-span-2 font-medium text-gray-500">Category</div>
        <button
          className="col-span-2 font-medium text-gray-500 text-left flex items-center"
          onClick={() => handleSort('date')}
        >
          Date
          <SortIndicator field="date" />
        </button>
        <div className="col-span-1 font-medium text-gray-500">Actions</div>
      </div>

      {/* Transaction Items */}
      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{startItem}</span> to{' '}
            <span className="font-medium">{endItem}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`w-8 h-8 rounded-md ${
                    currentPage === pageNum
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};