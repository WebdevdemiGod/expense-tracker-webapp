export default function TotalExpense() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Total Expenses</h3>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
        </div>
        <div className="p-3 rounded-xl bg-red-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12H16" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <span className="text-red-500 flex items-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-1" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12.6666V3.33325" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8.66663L8 12.6666" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 8.66663L8 12.6666" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          0.0%
        </span>
        <span className="ml-2">vs last month</span>
      </div>
    </div>
  );
}