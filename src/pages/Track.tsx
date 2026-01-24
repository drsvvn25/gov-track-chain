import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getRequest, ServiceRequest } from '@/lib/blockchain';
import StatusBadge from '@/components/StatusBadge';
import BlockchainExplorer from '@/components/BlockchainExplorer';
import { Search, Loader2, AlertCircle, Clock, User, FileText, Hash, CheckCircle } from 'lucide-react';

const Track = () => {
  const [searchParams] = useSearchParams();
  const [requestId, setRequestId] = useState(searchParams.get('id') || '');
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setRequestId(id);
      handleSearch(id);
    }
  }, [searchParams]);

  const handleSearch = async (id?: string) => {
    const searchId = id || requestId;
    if (!searchId) return;

    setIsLoading(true);
    setError('');
    setSearched(true);

    try {
      const result = await getRequest(parseInt(searchId));
      setRequest(result);
      if (!result) {
        setError('Request not found on blockchain');
      }
    } catch (err) {
      setError('Failed to fetch request');
      setRequest(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  const getStatusTimeline = () => {
    if (!request) return [];
    
    const timeline = [
      { 
        status: 'Submitted', 
        completed: true, 
        current: request.status === 'Pending',
        icon: FileText,
        date: formatDate(request.timestamp)
      },
      { 
        status: 'In Progress', 
        completed: request.status === 'InProgress' || request.status === 'Completed', 
        current: request.status === 'InProgress',
        icon: Clock,
        date: request.status !== 'Pending' ? 'Processing...' : ''
      },
      { 
        status: 'Completed', 
        completed: request.status === 'Completed', 
        current: request.status === 'Completed',
        icon: CheckCircle,
        date: request.status === 'Completed' ? 'Done!' : ''
      },
    ];
    
    return timeline;
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold mb-2">Track Your Request</h1>
            <p className="text-muted-foreground">
              Enter your request ID to view its status on the blockchain
            </p>
          </div>

          {/* Search Form */}
          <div className="glass-card p-6 mb-8">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  placeholder="Enter Request ID"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-muted/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={() => handleSearch()}
                disabled={isLoading || !requestId}
                variant="glow"
                size="lg"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                Search
              </Button>
            </div>
          </div>

          {/* Results */}
          {searched && (
            <div className="animate-fade-in">
              {isLoading ? (
                <div className="glass-card p-12 text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Fetching from blockchain...</p>
                </div>
              ) : error ? (
                <div className="glass-card p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <p className="text-lg font-medium mb-2">Request Not Found</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : request ? (
                <div className="space-y-6">
                  {/* Request Details Card */}
                  <div className="glass-card p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                          <FileText className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Request ID</span>
                          <h2 className="text-2xl font-display font-bold">#{request.id}</h2>
                        </div>
                      </div>
                      <StatusBadge status={request.status} size="lg" />
                    </div>

                    <div className="grid gap-6">
                      <div>
                        <span className="text-sm text-muted-foreground uppercase tracking-wider">Service Type</span>
                        <p className="text-lg font-medium mt-1">{request.service}</p>
                      </div>

                      <div>
                        <span className="text-sm text-muted-foreground uppercase tracking-wider">Description</span>
                        <p className="text-muted-foreground mt-1">{request.description}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="text-xs text-muted-foreground">Submitted</span>
                            <p className="text-sm font-medium">{formatDate(request.timestamp)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                          <User className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <span className="text-xs text-muted-foreground">Citizen</span>
                            <p className="text-sm font-mono">{formatAddress(request.citizen)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Status Timeline */}
                  <div className="glass-card p-8">
                    <h3 className="font-display font-semibold mb-6">Status Timeline</h3>
                    <div className="relative">
                      {/* Timeline Line */}
                      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
                      
                      <div className="space-y-6">
                        {getStatusTimeline().map((item, index) => (
                          <div key={item.status} className="relative flex items-start gap-4 pl-2">
                            {/* Timeline Dot */}
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                              item.current
                                ? 'bg-primary animate-pulse-glow ring-4 ring-primary/20'
                                : item.completed
                                  ? 'bg-success'
                                  : 'bg-muted border-2 border-border'
                            }`}>
                              {item.completed && !item.current ? (
                                <CheckCircle className="w-4 h-4 text-success-foreground" />
                              ) : (
                                <item.icon className={`w-4 h-4 ${item.current ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                              )}
                            </div>
                            
                            {/* Timeline Content */}
                            <div className={`flex-1 pb-6 ${index === 2 ? 'pb-0' : ''}`}>
                              <p className={`font-medium ${item.current ? 'text-primary' : item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {item.status}
                              </p>
                              {item.date && (
                                <p className="text-sm text-muted-foreground">{item.date}</p>
                              )}
                              {item.current && (
                                <div className="mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs inline-block">
                                  Current Status
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Explorer */}
                  <BlockchainExplorer request={request} />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Track;
