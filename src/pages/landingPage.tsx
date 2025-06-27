import { useState } from 'react';
import { FaChartLine, FaChartPie, FaMoneyBillWave } from 'react-icons/fa';
import LandingPageCard from "../components/landingPageCards";
import AuthModal from '../components/AuthModal';

export default function LandingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#F0FAF8] p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-6xl mx-auto text-center">
          <div className="mb-12 px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Expense Tracker App
            </h1>
            <h3 className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Track your expenses and manage your budget wisely
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full px-4">
            <LandingPageCard 
              icon={<FaChartLine />}
              title="Track Income"
              description="Monitor all your income sources and financial growth"
              borderColor="border-green-200"
            />
            <LandingPageCard 
              icon={<FaChartPie />}
              title="Track Expenses"
              description="Categorize and analyze your spending patterns"
              borderColor="border-blue-200"
            />
            <LandingPageCard 
              icon={<FaMoneyBillWave />}
              title="Monthly Reports"
              description="Get detailed insights and monthly summaries"
              borderColor="border-purple-200"
            />
          </div>
          
          <button 
            onClick={() => setShowAuthModal(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-all hover:scale-105 text-base sm:text-lg"
          >
            Get Started
          </button>
        </div>
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}