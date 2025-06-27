import { FaPlus, FaSignOutAlt, FaHome, FaExchangeAlt, FaCalendarAlt, FaChartLine, FaBars, FaTimes } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '../lib/supabase';
import { useState } from 'react';
import { TransactionForm } from './transactions/transactionForm';
import { FiX } from 'react-icons/fi';

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: FaHome },
  { name: 'Transactions', path: '/transactions', icon: FaExchangeAlt },
  { name: 'Calendar', path: '/calendar', icon: FaCalendarAlt },
  { name: 'Reports', path: '/reports', icon: FaChartLine },
];

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const supabase = createClient();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const activePage = location.pathname.split('/')[1] || 'dashboard';

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleAddTransaction = () => {
        setShowTransactionForm(true);
    };
    
    return (
        <>
            <nav className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-100">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="md:hidden mr-2">
                                <button
                                    onClick={toggleMenu}
                                    className="text-gray-500 hover:text-gray-600 focus:outline-none"
                                    aria-expanded={isMenuOpen}
                                    aria-label="Toggle menu"
                                >
                                    {isMenuOpen ? (
                                        <FaTimes className="h-6 w-6" />
                                    ) : (
                                        <FaBars className="h-6 w-6" />
                                    )}
                                </button>
                            </div>
                            <div className="flex-shrink-0 flex items-center">
                                <div className="text-green-500 font-bold text-2xl">
                                    <span className="inline-flex items-center">
                                        <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">$</span>
                                        <span>ExpenseTracker</span>
                                    </span>
                                </div>
                            </div>
                            <div className="hidden md:ml-6 md:flex md:space-x-2 lg:space-x-4">
                                {navigation.map((item) => {
                                    const isActive = activePage === item.path.split('/')[1];
                                    const Icon = item.icon;
                                    
                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            className={`inline-flex flex-col items-center px-2 py-2 lg:px-3 lg:py-2 text-sm font-medium ${
                                                isActive 
                                                    ? 'text-green-600' 
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                            title={item.name}
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="text-xs mt-1 hidden lg:inline">{item.name}</span>
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={handleAddTransaction}
                                className="inline-flex items-center p-2 sm:p-2 md:p-2 lg:px-4 lg:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <FaPlus className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Add Transaction</span>
                            </button>
                            
                            <button 
                                onClick={handleLogout}
                                className="inline-flex items-center p-2 sm:p-2 md:p-2 lg:px-4 lg:py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <FaSignOutAlt className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="pt-2 pb-3 space-y-1">
                        {navigation.map((item) => {
                            const isActive = activePage === item.path.split('/')[1];
                            const Icon = item.icon;
                            
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-3 py-2 text-base font-medium ${
                                        isActive 
                                            ? 'bg-green-50 text-green-600' 
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Icon className="h-5 w-5 mr-3" />
                                    {item.name}
                                </NavLink>
                            );
                        })}
                        <button
                            onClick={handleAddTransaction}
                            className="w-full flex items-center px-3 py-2 text-base font-medium text-left text-green-600 hover:bg-green-50 hover:text-green-800"
                        >
                            <FaPlus className="h-5 w-5 mr-3" />
                            Add Transaction
                        </button>
                    </div>
                </div>
            </nav>

            {/* Transaction Form Modal */}
            {showTransactionForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Add Transaction</h2>
                            <button 
                                onClick={() => setShowTransactionForm(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        </div>
                        <TransactionForm
                            transaction={null}
                            onSave={(transactionData) => {
                                // Create a new transaction object
                                const newTransaction = {
                                    ...transactionData,
                                    id: Math.random().toString(36).substr(2, 9),
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString()
                                };

                                // In a real app, you would make an API call here to save the transaction
                                console.log('Saving transaction:', newTransaction);

                                // Dispatch event to notify other components
                                window.dispatchEvent(new Event('transactionUpdated'));
                                
                                // Close the modal
                                setShowTransactionForm(false);
                                
                                // If on the transactions page, it will automatically refresh
                                // If not, the transactions will refresh when the user navigates there
                            }}
                            onClose={() => setShowTransactionForm(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}