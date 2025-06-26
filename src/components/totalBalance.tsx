export default function TotalBalance() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
          <p className="text-2xl font-bold text-gray-900">$0.00</p>
        </div>
        <div className="p-3 rounded-xl bg-green-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6V18" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 12H18" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500">
        <span className="text-green-500 flex items-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-1" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3.33337V12.6667" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 7.33337L8 3.33337" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 7.33337L8 3.33337" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          0.0%
        </span>
        <span className="ml-2">vs last month</span>
      </div>
    </div>
  );
}