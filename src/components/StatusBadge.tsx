import { RequestStatus } from '@/lib/blockchain';
import { Clock, Loader2, CheckCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = {
    Pending: {
      className: 'status-pending',
      icon: Clock,
      label: 'Pending',
    },
    InProgress: {
      className: 'status-in-progress',
      icon: Loader2,
      label: 'In Progress',
    },
    Completed: {
      className: 'status-completed',
      icon: CheckCircle,
      label: 'Completed',
    },
  };

  const { className, icon: Icon, label } = config[status];

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${className} ${sizeClasses[size]}`}>
      <Icon className={`${iconSizes[size]} ${status === 'InProgress' ? 'animate-spin' : ''}`} />
      {label}
    </span>
  );
};

export default StatusBadge;
