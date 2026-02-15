import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Users,
  DollarSign,
  MousePointerClick,
  Sparkles,
  AlertCircle,
  Lightbulb,
  Target,
  Activity,
  BarChart3,
  Calendar,
  Eye,
  Clock,
  ArrowUp,
  ArrowDown,
  ArrowLeft
} from 'lucide-react';
import { supabase, Campaign, AnalyticsMetric, AIInsight, ContentPerformance } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsMetric[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [content, setContent] = useState<ContentPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    const [campaignsData, analyticsData, insightsData, contentData] = await Promise.all([
      supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
      supabase.from('analytics_metrics').select('*').order('date', { ascending: false }).limit(30),
      supabase.from('ai_insights').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('content_performance').select('*').order('views', { ascending: false }).limit(6)
    ]);

    if (campaignsData.data) setCampaigns(campaignsData.data);
    if (analyticsData.data) setAnalytics(analyticsData.data);
    if (insightsData.data) setInsights(insightsData.data);
    if (contentData.data) setContent(contentData.data);

    setLoading(false);
  };

  const getTodayMetrics = () => {
    if (analytics.length === 0) return null;
    const today = analytics[0];
    const yesterday = analytics[1] || today;

    return {
      pageViews: {
        value: today.page_views,
        change: ((today.page_views - yesterday.page_views) / yesterday.page_views * 100).toFixed(1)
      },
      visitors: {
        value: today.unique_visitors,
        change: ((today.unique_visitors - yesterday.unique_visitors) / yesterday.unique_visitors * 100).toFixed(1)
      },
      revenue: {
        value: today.revenue,
        change: ((today.revenue - yesterday.revenue) / yesterday.revenue * 100).toFixed(1)
      },
      conversionRate: {
        value: today.conversion_rate,
        change: ((today.conversion_rate - yesterday.conversion_rate) / yesterday.conversion_rate * 100).toFixed(1)
      }
    };
  };

  const metrics = getTodayMetrics();

  const getTotalCampaignStats = () => {
    return campaigns.reduce((acc, campaign) => ({
      totalSpent: acc.totalSpent + Number(campaign.spent),
      totalRevenue: acc.totalRevenue + Number(campaign.revenue),
      totalConversions: acc.totalConversions + campaign.conversions,
      totalClicks: acc.totalClicks + campaign.clicks
    }), { totalSpent: 0, totalRevenue: 0, totalConversions: 0, totalClicks: 0 });
  };

  const campaignStats = getTotalCampaignStats();

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => (window as any).navigate?.('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-6 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Marketing Dashboard
            </h1>
            <p className="text-gray-600 mt-1">AI-powered insights and analytics</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-orange-200 shadow-sm">
            <Activity size={18} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Live</span>
          </div>
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Page Views"
              value={formatNumber(metrics.pageViews.value)}
              change={Number(metrics.pageViews.change)}
              icon={<Eye size={24} />}
            />
            <MetricCard
              title="Unique Visitors"
              value={formatNumber(metrics.visitors.value)}
              change={Number(metrics.visitors.change)}
              icon={<Users size={24} />}
            />
            <MetricCard
              title="Revenue"
              value={formatCurrency(metrics.revenue.value)}
              change={Number(metrics.revenue.change)}
              icon={<DollarSign size={24} />}
            />
            <MetricCard
              title="Conversion Rate"
              value={`${metrics.conversionRate.value.toFixed(1)}%`}
              change={Number(metrics.conversionRate.change)}
              icon={<TrendingUp size={24} />}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles size={20} className="text-orange-600" />
                AI Insights & Recommendations
              </h2>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
                {insights.filter(i => i.status === 'new').length} New
              </span>
            </div>
            <div className="space-y-4">
              {insights.slice(0, 5).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Target size={20} className="text-orange-600" />
              Campaign Overview
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(campaignStats.totalSpent)}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(campaignStats.totalRevenue)}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">ROI</p>
                <p className="text-2xl font-bold text-orange-600">
                  {((campaignStats.totalRevenue / campaignStats.totalSpent - 1) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Clicks</p>
                  <p className="text-lg font-bold text-gray-900">{formatNumber(campaignStats.totalClicks)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-600 mb-1">Conversions</p>
                  <p className="text-lg font-bold text-gray-900">{formatNumber(campaignStats.totalConversions)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-orange-600" />
              Active Campaigns
            </h2>
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-orange-600" />
              Top Performing Content
            </h2>
            <div className="space-y-4">
              {content.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white">
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
          isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

interface InsightCardProps {
  insight: AIInsight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getIcon = () => {
    switch (insight.type) {
      case 'recommendation':
        return <Lightbulb size={18} className="text-amber-500" />;
      case 'alert':
        return <AlertCircle size={18} className="text-red-500" />;
      default:
        return <Sparkles size={18} className="text-orange-500" />;
    }
  };

  const getImpactColor = () => {
    switch (insight.impact) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-amber-600 bg-amber-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-4 border border-orange-100 rounded-xl hover:bg-orange-50/30 transition-colors">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-sm">{insight.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getImpactColor()}`}>
              {insight.impact}
            </span>
          </div>
          <p className="text-sm text-gray-600">{insight.description}</p>
        </div>
      </div>
    </div>
  );
};

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const getStatusColor = () => {
    switch (campaign.status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'paused':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions * 100).toFixed(2) : '0.00';
  const cvr = campaign.clicks > 0 ? (campaign.conversions / campaign.clicks * 100).toFixed(2) : '0.00';

  return (
    <div className="p-4 border border-orange-100 rounded-xl hover:bg-orange-50/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">{campaign.name}</h3>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {campaign.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-gray-500">CTR</p>
          <p className="font-semibold text-gray-900">{ctr}%</p>
        </div>
        <div>
          <p className="text-gray-500">CVR</p>
          <p className="font-semibold text-gray-900">{cvr}%</p>
        </div>
        <div>
          <p className="text-gray-500">Spent</p>
          <p className="font-semibold text-gray-900">${(Number(campaign.spent) / 1000).toFixed(0)}K</p>
        </div>
        <div>
          <p className="text-gray-500">Revenue</p>
          <p className="font-semibold text-orange-600">${(Number(campaign.revenue) / 1000).toFixed(0)}K</p>
        </div>
      </div>
    </div>
  );
};

interface ContentCardProps {
  content: ContentPerformance;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  return (
    <div className="p-4 border border-orange-100 rounded-xl hover:bg-orange-50/30 transition-colors">
      <h3 className="font-semibold text-gray-900 text-sm mb-3">{content.title}</h3>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <p className="text-gray-500 flex items-center gap-1">
            <Eye size={12} />
            Views
          </p>
          <p className="font-semibold text-gray-900">{(content.views / 1000).toFixed(1)}K</p>
        </div>
        <div>
          <p className="text-gray-500 flex items-center gap-1">
            <Clock size={12} />
            Avg Time
          </p>
          <p className="font-semibold text-gray-900">{Math.floor(content.avg_time_on_page / 60)}m</p>
        </div>
        <div>
          <p className="text-gray-500 flex items-center gap-1">
            <MousePointerClick size={12} />
            Conv
          </p>
          <p className="font-semibold text-orange-600">{content.conversions}</p>
        </div>
      </div>
    </div>
  );
};
