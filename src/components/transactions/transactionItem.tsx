import type { Transaction } from './types';
import { FaArrowDown, FaArrowUp, FaEdit, FaTrash } from 'react-icons/fa';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TransactionItem = ({ transaction, onEdit, onDelete }: TransactionItemProps) => {
  const isIncome = transaction.type === 'income';
  const amountClass = isIncome ? 'text-green-600' : 'text-red-600';
  const amountPrefix = isIncome ? '+' : '-';
  
  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50">
      <div className="col-span-5 flex items-center">
        <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'} mr-3`}>
          {isIncome ? (
            <FaArrowUp className="text-green-600" />
          ) : (
            <FaArrowDown className="text-red-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{transaction.description}</p>
          <p className="text-sm text-gray-500">{transaction.category}</p>
        </div>
      </div>
      <div className={`col-span-2 font-medium ${amountClass}`}>
        {amountPrefix}${Math.abs(transaction.amount).toFixed(2)}
      </div>
      <div className="col-span-2 text-sm text-gray-500">
        {transaction.category}
      </div>
      <div className="col-span-2 text-sm text-gray-500">
        {new Date(transaction.date).toLocaleDateString()}
      </div>
      <div className="col-span-1 flex space-x-2 justify-end">
        <button
          onClick={() => onEdit(transaction.id)}
          className="text-gray-400 hover:text-blue-600 p-1"
          aria-label="Edit transaction"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(transaction.id)}
          className="text-gray-400 hover:text-red-600 p-1"
          aria-label="Delete transaction"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};