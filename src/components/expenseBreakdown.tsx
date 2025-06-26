import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Food', value: 30, color: '#4F46E5' },
  { name: 'Transport', value: 20, color: '#10B981' },
  { name: 'Shopping', value: 25, color: '#F59E0B' },
  { name: 'Bills', value: 15, color: '#EF4444' },
  { name: 'Others', value: 10, color: '#8B5CF6' },
];

export default function ExpenseBreakdown() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Expense Breakdown</h2>
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>This Day</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full md:w-1/2 grid grid-cols-2 gap-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: item.color }}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{item.value}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}