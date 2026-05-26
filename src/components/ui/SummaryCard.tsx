import React from 'react';

interface SummaryCardProps {
  icon: string;
  title: string;
  value: number;
  color: 'blue' | 'yellow' | 'red' | 'purple' | 'green';
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, color }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 border-l-4 border-blue-500',
    yellow: 'bg-yellow-50 border-l-4 border-yellow-500',
    red: 'bg-red-50 border-l-4 border-red-500',
    purple: 'bg-purple-50 border-l-4 border-purple-500',
    green: 'bg-green-50 border-l-4 border-green-500',
  };

  const valueColorClasses: Record<string, string> = {
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4 shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs font-semibold">{title}</p>
          <p className={`text-3xl font-bold ${valueColorClasses[color]} mt-1`}>{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
};

export default SummaryCard;
