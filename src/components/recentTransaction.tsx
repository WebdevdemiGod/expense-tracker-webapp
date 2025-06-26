import { FaShoppingBag, FaUtensils, FaBus, FaFileInvoiceDollar } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';

const transactions = [
  {
    id: 1,
    title: 'Shopping',
    description: 'Grocery store',
    amount: '-$120.00',
    date: 'Today, 10:30 AM',
    icon: <FaShoppingBag className="text-blue-500" />,
    type: 'expense',
    category: 'Shopping'
  },
  {
    id: 2,
    title: 'Food & Drink',
    description: 'Restaurant',
    amount: '-$45.80',
    date: 'Today, 1:15 PM',
    icon: <FaUtensils className="text-green-500" />,
    type: 'expense',
    category: 'Food'
  },
  {
    id: 3,
    title: 'Transport',
    description: 'Bus ticket',
    amount: '-$2.50',
    date: 'Yesterday',
    icon: <FaBus className="text-yellow-500" />,
    type: 'expense',
    category: 'Transport'
  },
  {
    id: 4,
    title: 'Salary',
    description: 'Monthly salary',
    amount: '+$4,500.00',
    date: 'Jun 25',
    icon: <FaFileInvoiceDollar className="text-purple-500" />,
    type: 'income',
    category: 'Income'
  }
];

export default function RecentTransactions() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <BsThreeDotsVertical />
        </button>
      </div>
      
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                {transaction.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
                <p className="text-xs text-gray-500">{transaction.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'}`}>
                {transaction.amount}
              </p>
              <p className="text-xs text-gray-400">{transaction.date}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none">
        View All Transactions
      </button>
    </div>
  );
}