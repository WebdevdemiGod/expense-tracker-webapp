import { useState, useEffect } from 'react';
import type { Transaction, TransactionFilters } from '../components/transactions/types';
import { TransactionList } from '../components/transactions/transactionList';
import { FilterBar } from '../components/transactions/filterbar';
import { SummaryWidget } from '../components/transactions/summaryWidget';
import { TransactionForm } from '../components/transactions/transactionForm';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [filters, setFilters] = useState<Omit<TransactionFilters, 'sortBy' | 'sortOrder'>>({
    searchTerm: '',
    type: 'all',
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });
  const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'amount'; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const mockTransactions: Transaction[] = [];
        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Listen for transaction updates from anywhere in the app
    const handleTransactionUpdate = () => {
      console.log('Refreshing transactions...');
      fetchTransactions();
    };

    window.addEventListener('transactionUpdated', handleTransactionUpdate);
    
    return () => {
      window.removeEventListener('transactionUpdated', handleTransactionUpdate);
    };
  }, []);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    // TODO: Replace with actual API call
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Update local state
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Notify other components
    window.dispatchEvent(new Event('transactionUpdated'));
    
    return newTransaction;
  };

  const handleUpdateTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (!editingTransaction) return;
    
    const updatedTransaction: Transaction = { 
      ...transaction, 
      id: editingTransaction.id,
      updatedAt: new Date().toISOString() 
    };
    
    // Update local state
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t)
    );
    
    // Reset form
    setEditingTransaction(null);
    setShowForm(false);
    
    // Notify other components
    window.dispatchEvent(new Event('transactionUpdated'));
  };

  const handleDeleteTransaction = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        // TODO: Replace with actual API call
        setTransactions(transactions.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleEdit = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setEditingTransaction(transaction);
      setShowForm(true);
    }
  };

  const handleSort = (field: 'date' | 'amount') => {
    setSortConfig(prev => ({
      key: field,
      direction: prev.key === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Wrap setFilters to handle Partial<TransactionFilters>
  const updateFilters = (updates: Partial<TransactionFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...updates,
      searchTerm: updates.searchTerm ?? prev.searchTerm,
      type: updates.type ?? prev.type,
      category: updates.category ?? prev.category,
      startDate: updates.startDate ?? prev.startDate,
      endDate: updates.endDate ?? prev.endDate,
      minAmount: updates.minAmount ?? prev.minAmount,
      maxAmount: updates.maxAmount ?? prev.maxAmount
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesType = filters.type === 'all' || transaction.type === filters.type;
      // Add more filters as needed
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortConfig.direction === 'asc' 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      }
    });

  // Pagination
  // Used in pagination calculation
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };



  return (
    <div className="mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <SummaryWidget transactions={transactions} />
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <FilterBar 
          filters={filters}
          onFilterChange={updateFilters}
          categories={[]} // TODO: Fetch categories from your data source
        />
        
        <TransactionList
          transactions={paginatedTransactions}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteTransaction}
          sortBy={sortConfig.key}
          sortOrder={sortConfig.direction}
          onSort={handleSort}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={filteredTransactions.length}
          onPageChange={handlePageChange}
        />
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <TransactionForm
              transaction={editingTransaction}
              onSave={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
              onClose={() => {
                setShowForm(false);
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
