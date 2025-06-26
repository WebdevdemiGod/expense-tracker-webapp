import { FaPlus } from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { createClient } from '../lib/supabase';

export default function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const supabase = createClient();
    const activePage = location.pathname.split('/')[1] || 'dashboard';
    const navItems = ['Dashboard', 'Transactions', 'Calendar', 'Reports'];

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
        <nav className="w-full bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="text-green-500 font-bold text-2xl">
                                <span className="inline-flex items-center">
                                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">$</span>
                                    ExpenseTracker
                                </span>
                            </div>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            {navItems.map((item) => {
                                const path = `/${item.toLowerCase()}`;
                                const isActive = activePage === item.toLowerCase();
                                
                                return (
                                    <NavLink
                                        key={item}
                                        to={path}
                                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                                            isActive 
                                                ? 'border-green-500 text-green-600 bg-green-50' 
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        }`}
                                    >
                                        {item}
                                    </NavLink>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <FaPlus className="-ml-1 mr-2 h-4 w-4" />
                            Add Transaction
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="ml-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}