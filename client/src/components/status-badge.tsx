import { Badge } from '@/components/ui/badge';
import { getStatusVariant } from '@shared/businessLogic';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = getStatusVariant(status);
  
  return (
    <Badge 
      variant={variant} 
      className={`uppercase text-xs font-semibold ${className}`}
      data-testid={`badge-status-${status.toLowerCase()}`}
    >
      {status}
    </Badge>
  );
}
