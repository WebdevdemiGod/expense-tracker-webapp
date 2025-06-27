
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
  type: TransactionType;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionFilters {
  searchTerm: string;
  type: TransactionType | 'all';
  category: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}