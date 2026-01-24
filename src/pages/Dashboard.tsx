import { useState, useEffect } from 'react';
import { getAllRequests, getStatistics, ServiceRequest } from '@/lib/blockchain';
import RequestCard from '@/components/RequestCard';
import StatCard from '@/components/StatCard';
import { BarChart3, Clock, Loader2, CheckCircle, AlertCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Pending' | 'InProgress' | 'Completed'>('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allRequests, statistics] = await Promise.all([
        getAllRequests(),
        getStatistics(),
      ]);
      setRequests(allRequests);
      setStats(statistics);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status === filter);

  const filterButtons = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'Pending', label: 'Pending', count: stats.pending },
    { value: 'InProgress', label: 'In Progress', count: stats.inProgress },
    { value: 'Completed', label: 'Completed', count: stats.completed },
  ] as const;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Public Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time overview of all government service requests on blockchain
            </p>
          </div>
          <Button onClick={loadData} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard
                title="Total Requests"
                value={stats.total}
                icon={BarChart3}
                variant="primary"
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                icon={Clock}
                variant="warning"
              />
              <StatCard
                title="In Progress"
                value={stats.inProgress}
                icon={TrendingUp}
                variant="primary"
              />
              <StatCard
                title="Completed"
                value={stats.completed}
                icon={CheckCircle}
                variant="success"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {filterButtons.map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    filter === btn.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {btn.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filter === btn.value
                      ? 'bg-primary-foreground/20'
                      : 'bg-muted'
                  }`}>
                    {btn.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Requests Grid */}
            {filteredRequests.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No Requests Found</p>
                <p className="text-muted-foreground">
                  {filter === 'all' 
                    ? 'No service requests have been submitted yet.'
                    : `No ${filter.toLowerCase()} requests at the moment.`
                  }
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request, index) => (
                  <div 
                    key={request.id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <RequestCard request={request} showCitizen />
                  </div>
                ))}
              </div>
            )}

            {/* Transparency Notice */}
            <div className="mt-12 glass-card p-6 text-center">
              <p className="text-muted-foreground text-sm">
                🔒 All data displayed is fetched directly from the blockchain and cannot be tampered with.
                <br />
                Every transaction is publicly verifiable on the Ethereum network.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
