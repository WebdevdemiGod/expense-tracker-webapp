import type { ReactNode } from 'react';

interface LandingPageCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  borderColor?: string;
}

export default function LandingPageCard({ 
  icon, 
  title, 
  description, 
  borderColor = 'border-gray-200' 
}: LandingPageCardProps) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border ${borderColor} flex flex-col items-center text-center h-full`}>
      <div className="text-4xl mb-4 text-blue-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}