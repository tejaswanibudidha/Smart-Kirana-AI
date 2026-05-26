import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface AlertBannerProps {
  severity: 'critical' | 'warning' | 'info';
  message: string;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ severity, message }) => {
  const severityClasses: Record<string, string> = {
    critical: 'bg-red-50 border-l-4 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-l-4 border-blue-500 text-blue-800',
  };

  const icons = {
    critical: <AlertCircle className="text-red-600" size={24} />,
    warning: <AlertTriangle className="text-yellow-600" size={24} />,
    info: <Info className="text-blue-600" size={24} />,
  };

  return (
    <div className={`${severityClasses[severity]} rounded-lg p-4 flex items-center gap-3`}>
      {icons[severity]}
      <p className="font-bold text-sm">{message}</p>
    </div>
  );
};

export default AlertBanner;
