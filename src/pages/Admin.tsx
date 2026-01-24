import { useState, useEffect } from 'react';
import { getAllRequests, updateRequestStatus, ServiceRequest, RequestStatus } from '@/lib/blockchain';
import { useWallet } from '@/context/WalletContext';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, Clock, CheckCircle, Play, RefreshCw, Lock } from 'lucide-react';
import { toast } from 'sonner';

const Admin = () => {
  const { address, isAdmin, setIsAdmin, connectWallet, isConnecting } = useWallet();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const allRequests = await getAllRequests();
      setRequests(allRequests);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadRequests();
    }
  }, [isAdmin]);

  const handleStatusUpdate = async (id: number, newStatus: RequestStatus) => {
    setUpdatingId(id);
    try {
      await updateRequestStatus(id, newStatus);
      toast.success(`Request #${id} updated to ${newStatus}`);
      loadRequests();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Not logged in as admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="glass-card p-12">
              <div className="w-20 h-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-warning" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-4">Admin Access Required</h2>
              <p className="text-muted-foreground mb-8">
                This page is restricted to government administrators only.
              </p>
              
              {!address ? (
                <Button 
                  onClick={connectWallet}
                  disabled={isConnecting}
                  variant="glow"
                  size="lg"
                  className="w-full mb-4"
                >
                  Connect Wallet First
                </Button>
              ) : null}
              
              <Button
                onClick={() => setIsAdmin(true)}
                variant={address ? 'glow' : 'outline'}
                size="lg"
                className="w-full"
                disabled={!address}
              >
                <Shield className="w-5 h-5" />
                Login as Admin (Demo)
              </Button>

              <p className="text-xs text-muted-foreground mt-4">
                In production, admin access would be verified via smart contract role
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Manage and update service requests</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={loadRequests} variant="outline" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => setIsAdmin(false)} 
              variant="ghost"
              className="text-destructive hover:text-destructive"
            >
              Logout
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-lg font-medium mb-2">No Requests</p>
                <p className="text-muted-foreground">No service requests have been submitted yet.</p>
              </div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="glass-card p-6 hover:border-primary/30 transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Request Info */}
                    <div className="flex-1 grid md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">ID</span>
                        <p className="font-display font-bold text-lg">#{request.id}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Service</span>
                        <p className="font-medium">{request.service}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Citizen</span>
                        <p className="font-mono text-sm">{formatAddress(request.citizen)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Submitted</span>
                        <p className="text-sm">{formatDate(request.timestamp)}</p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <StatusBadge status={request.status} />
                      
                      <div className="flex gap-2">
                        {request.status === 'Pending' && (
                          <Button
                            onClick={() => handleStatusUpdate(request.id, 'InProgress')}
                            disabled={updatingId === request.id}
                            size="sm"
                            variant="outline"
                            className="gap-1"
                          >
                            {updatingId === request.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                            Start
                          </Button>
                        )}
                        {request.status === 'InProgress' && (
                          <Button
                            onClick={() => handleStatusUpdate(request.id, 'Completed')}
                            disabled={updatingId === request.id}
                            size="sm"
                            variant="success"
                            className="gap-1"
                          >
                            {updatingId === request.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Complete
                          </Button>
                        )}
                        {request.status === 'Completed' && (
                          <span className="text-sm text-success flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Done
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-sm text-muted-foreground">{request.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Info Note */}
        <div className="mt-8 glass-card p-4 text-center">
          <p className="text-sm text-muted-foreground">
            ⚡ Status updates are recorded on the blockchain with a new transaction hash
          </p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
