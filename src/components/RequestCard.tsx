import { ServiceRequest } from '@/lib/blockchain';
import StatusBadge from './StatusBadge';
import { ExternalLink, Clock, User, FileText } from 'lucide-react';

interface RequestCardProps {
  request: ServiceRequest;
  showCitizen?: boolean;
}

const RequestCard = ({ request, showCitizen = false }: RequestCardProps) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="glass-card p-5 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Request ID</span>
            <h3 className="font-display font-semibold text-lg">#{request.id}</h3>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <div className="space-y-3">
        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Service Type</span>
          <p className="font-medium text-foreground">{request.service}</p>
        </div>

        <div>
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Description</span>
          <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
        </div>

        <div className="flex flex-wrap gap-4 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {formatDate(request.timestamp)}
          </div>
          
          {showCitizen && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="font-mono">{formatAddress(request.citizen)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <span className="text-xs text-muted-foreground">TX:</span>
          <a 
            href={`https://sepolia.etherscan.io/tx/${request.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-mono"
          >
            {request.txHash.slice(0, 16)}...
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
