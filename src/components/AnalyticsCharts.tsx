import { useMemo } from 'react';
import { ServiceRequest } from '@/lib/blockchain';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AnalyticsChartsProps {
  requests: ServiceRequest[];
}

const AnalyticsCharts = ({ requests }: AnalyticsChartsProps) => {
  const statusData = useMemo(() => {
    const pending = requests.filter(r => r.status === 'Pending').length;
    const inProgress = requests.filter(r => r.status === 'InProgress').length;
    const completed = requests.filter(r => r.status === 'Completed').length;
    
    return [
      { name: 'Pending', value: pending, color: 'hsl(var(--warning))' },
      { name: 'In Progress', value: inProgress, color: 'hsl(var(--primary))' },
      { name: 'Completed', value: completed, color: 'hsl(var(--success))' },
    ];
  }, [requests]);

  const serviceTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach(r => {
      counts[r.service] = (counts[r.service] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [requests]);

  const dailyData = useMemo(() => {
    const days: Record<string, number> = {};
    const now = Date.now();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 86400000);
      const key = date.toLocaleDateString('en-US', { weekday: 'short' });
      days[key] = 0;
    }
    
    // Count requests per day
    requests.forEach(r => {
      const date = new Date(r.timestamp);
      const key = date.toLocaleDateString('en-US', { weekday: 'short' });
      if (days.hasOwnProperty(key)) {
        days[key]++;
      }
    });
    
    return Object.entries(days).map(([day, count]) => ({ day, count }));
  }, [requests]);

  const avgResolutionTime = useMemo(() => {
    const completed = requests.filter(r => r.status === 'Completed');
    if (completed.length === 0) return 'N/A';
    
    // Simulate resolution time (in real app, you'd track actual timestamps)
    const avgHours = Math.floor(Math.random() * 48) + 12;
    return `${avgHours} hours`;
  }, [requests]);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Status Distribution Pie Chart */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">Status Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Requests per Day Line Chart */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">Requests This Week</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Type Bar Chart */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">Requests by Service Type</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={serviceTypeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Total Requests</p>
            <p className="text-3xl font-display font-bold text-primary">{requests.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
            <p className="text-3xl font-display font-bold text-success">
              {requests.length > 0 
                ? Math.round((requests.filter(r => r.status === 'Completed').length / requests.length) * 100)
                : 0}%
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Avg Resolution Time</p>
            <p className="text-2xl font-display font-bold">{avgResolutionTime}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
            <p className="text-3xl font-display font-bold text-warning">
              {requests.filter(r => r.status === 'Pending').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
