import { useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import type { TransactionFilters } from './types';

interface FilterBarProps {
  filters: Omit<TransactionFilters, 'sortBy' | 'sortOrder'>;
  onFilterChange: (filters: Partial<TransactionFilters>) => void;
  categories: string[];
}

export const FilterBar = ({ filters, onFilterChange, categories }: FilterBarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      searchTerm: '',
      type: 'all',
      category: 'all',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    });
  };

  return (
    <div className={`mb-4 p-4`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            name="searchTerm"
            placeholder="Search by description or category..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            value={filters.searchTerm}
            onChange={handleInputChange}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FiFilter className="mr-2" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={filters.type}
                onChange={handleInputChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleInputChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleInputChange}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleInputChange}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  name="minAmount"
                  placeholder="Min"
                  value={filters.minAmount}
                  onChange={handleInputChange}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <input
                  type="number"
                  name="maxAmount"
                  placeholder="Max"
                  value={filters.maxAmount}
                  onChange={handleInputChange}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
            >
              <FiX className="mr-1" /> Reset all filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;