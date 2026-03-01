import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { blink, Lead, Deal } from '@/lib/blink';
import { useQuery } from '@tanstack/react-query';
import { 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';

/**
 * Dashboard Page
 * 
 * Displays revenue, pipeline, conversion, and AI-driven insights.
 */
export const Dashboard: React.FC = () => {
  const { organization } = useAuth();

  // Fetch Leads
  const { data: leads = [] } = useQuery({
    queryKey: ['leads', organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      return await (blink.db as any).leads.list({
        where: { orgId: organization.id },
        limit: 100
      }) as Lead[];
    },
    enabled: !!organization,
  });

  // Fetch Deals
  const { data: deals = [] } = useQuery({
    queryKey: ['deals', organization?.id],
    queryFn: async () => {
      if (!organization) return [];
      return await (blink.db as any).deals.list({
        where: { orgId: organization.id },
        limit: 100
      }) as Deal[];
    },
    enabled: !!organization,
  });

  // Calculate Metrics
  const totalRevenue = deals
    .filter((d: Deal) => d.stage === 'closed_won')
    .reduce((sum: number, d: Deal) => sum + Number(d.value), 0);

  const pipelineValue = deals
    .filter((d: Deal) => ['discovery', 'proposal', 'negotiation'].includes(d.stage))
    .reduce((sum: number, d: Deal) => sum + Number(d.value), 0);

  const closedDeals = deals.filter((d: Deal) => ['closed_won', 'closed_lost'].includes(d.stage));
  const conversionRate = closedDeals.length > 0 
    ? (deals.filter((d: Deal) => d.stage === 'closed_won').length / closedDeals.length) * 100 
    : 0;

  const newLeadsCount = leads.filter((l: Lead) => l.status === 'new').length;

  // Chart Data
  const chartData = [
    { name: 'Mon', revenue: 4000, pipeline: 2400 },
    { name: 'Tue', revenue: 3000, pipeline: 1398 },
    { name: 'Wed', revenue: 2000, pipeline: 9800 },
    { name: 'Thu', revenue: 2780, pipeline: 3908 },
    { name: 'Fri', revenue: 1890, pipeline: 4800 },
    { name: 'Sat', revenue: 2390, pipeline: 3800 },
    { name: 'Sun', revenue: 3490, pipeline: 4300 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
            <p className="text-muted-foreground">Welcome back. Here's what's happening with your sales funnel today.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AI scoring is active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-elegant border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500 font-medium inline-flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5%
                </span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
              <Target className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${pipelineValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500 font-medium inline-flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +4.2%
                </span> since yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Zap className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-rose-500 font-medium inline-flex items-center">
                  <ArrowDownRight className="w-3 h-3 mr-1" /> -1.4%
                </span> vs industry avg
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">New Leads</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{newLeadsCount}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500 font-medium inline-flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> +18
                </span> in the last 7 days
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          {/* Revenue Chart */}
          <Card className="md:col-span-4 overflow-hidden border-none shadow-elegant">
            <CardHeader>
              <CardTitle>Sales Velocity</CardTitle>
              <CardDescription>Daily revenue and pipeline growth analysis.</CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights Panel */}
          <Card className="md:col-span-3 bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-glow">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>AI Sales Insights</CardTitle>
                  <CardDescription className="text-primary/60">Powered by NeuralFlow AI</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-card border border-primary/10 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Deal Risk Alert
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The "Enterprise Cloud" deal has been in 'Negotiation' for 14 days without activity. Recommendation: Send a follow-up email today.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-primary/10 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Forecast Prediction
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on current lead velocity, you are on track to exceed your Q1 target by 12%. New high-intent leads from LinkedIn are driving this growth.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-primary/10 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Task Priority
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  NeuralFlow identified 3 qualified leads that haven't been contacted. They have an average lead score of 88/100.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your team's latest interactions across all modules.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      <span className="text-foreground">Sarah Chen</span> moved <span className="text-primary font-semibold underline decoration-primary/30 underline-offset-4 cursor-pointer">Global Expansion</span> to <span className="font-semibold">Proposal</span>
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                  <div className="text-sm font-bold text-foreground">$12,000</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
