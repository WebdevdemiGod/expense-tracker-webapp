import { FaPlus, FaSignOutAlt, FaHome, FaExchangeAlt, FaCalendarAlt, FaChartLine, FaBars, FaTimes } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '../lib/supabase';
import { useState } from 'react';

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
    
    return (
        <nav className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-100">
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
                        <button className="inline-flex items-center p-2 sm:p-2 md:p-2 lg:px-4 lg:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
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
            <div className={`fixed inset-0 z-40 ${isMenuOpen ? 'block' : 'hidden'}`}>
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                    onClick={toggleMenu}
                    aria-hidden="true" 
                />
                <div className="fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ease-in-out bg-white rounded-t-2xl shadow-xl" style={{
                    transform: isMenuOpen ? 'translateY(0)' : 'translateY(100%)'
                }}>
                    <div className="px-4 pt-5 pb-8 space-y-3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Menu</h3>
                            <button
                                onClick={toggleMenu}
                                className="text-gray-400 hover:text-gray-500"
                                aria-label="Close menu"
                            >
                                <FaTimes className="h-6 w-6" />
                            </button>
                        </div>
                        
                        <nav className="space-y-2">
                            {navigation.map((item) => {
                                const isActive = activePage === item.path.split('/')[1];
                                const Icon = item.icon;
                                
                                return (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        onClick={toggleMenu}
                                        className={`flex items-center px-4 py-3 rounded-xl text-base font-medium ${
                                            isActive 
                                                ? 'bg-green-50 text-green-700' 
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 mr-3 text-gray-500" />
                                        {item.name}
                                    </NavLink>
                                );
                            })}
                            <button 
                                onClick={() => {
                                    toggleMenu();
                                    handleLogout();
                                }}
                                className="flex items-center w-full px-4 py-3 text-base font-medium text-left text-red-600 rounded-xl hover:bg-red-50"
                            >
                                <FaSignOutAlt className="h-5 w-5 mr-3" />
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </nav>
    );
}