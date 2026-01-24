import { useState, useEffect } from 'react';
import { getAllRequests, ServiceRequest } from '@/lib/blockchain';
import { Book, ExternalLink, Loader2, RefreshCw, Shield, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';

const PublicLedger = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const allRequests = await getAllRequests();
      setRequests(allRequests);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Book className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">Public Ledger</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            All government service requests are publicly auditable on the blockchain.
            <br />
            <span className="text-primary font-medium">Complete transparency. Zero tampering.</span>
          </p>
        </div>

        {/* Transparency Banner */}
        <div className="glass-card p-6 mb-8 border-primary/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-lg">All Government Actions Are Publicly Auditable</h3>
              <p className="text-muted-foreground text-sm">
                Every record below is immutably stored on the blockchain and can be independently verified.
              </p>
            </div>
            <Button onClick={loadData} variant="outline" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Ledger Table */}
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Citizen
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Tx Hash
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {requests.map((request) => (
                      <tr 
                        key={request.id} 
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="font-display font-bold text-primary">#{request.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium">{request.service}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-muted-foreground">
                            {formatAddress(request.citizen)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={request.status} />
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(request.timestamp)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <a
                            href={`https://sepolia.etherscan.io/tx/${request.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 font-mono"
                          >
                            {request.txHash.slice(0, 10)}...
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {requests.length === 0 && (
                <div className="p-12 text-center">
                  <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium">No Records Yet</p>
                  <p className="text-muted-foreground">The ledger is empty. Submit a request to get started.</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="glass-card p-6 text-center">
                <p className="text-3xl font-display font-bold text-primary">{requests.length}</p>
                <p className="text-sm text-muted-foreground">Total Records</p>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-3xl font-display font-bold text-success">
                  {requests.filter(r => r.status === 'Completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="glass-card p-6 text-center">
                <p className="text-3xl font-display font-bold glow-text">100%</p>
                <p className="text-sm text-muted-foreground">Transparency</p>
              </div>
            </div>

            {/* Blockchain Info */}
            <div className="glass-card p-6 mt-8 text-center">
              <p className="text-muted-foreground text-sm">
                🔗 All records are stored on the <strong className="text-primary">Ethereum Sepolia Testnet</strong>
                <br />
                Verify any transaction on{' '}
                <a 
                  href="https://sepolia.etherscan.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Etherscan Explorer →
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicLedger;
