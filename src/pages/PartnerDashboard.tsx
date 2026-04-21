import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Eye, BookmarkCheck, Star, ArrowUpRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api-client';
import type { PartnerStats, AnalyticsMetric } from '@shared/types';
export function PartnerDashboard() {
  const { data } = useQuery({
    queryKey: ['partner-stats', 'p-1'],
    queryFn: () => api<{ stats: PartnerStats; series: AnalyticsMetric[] }>('/api/partner/stats/p-1')
  });
  const stats = data?.stats;
  const series = data?.series;
  return (
    <AppLayout className="bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Partner Intelligence</h1>
            <p className="text-muted-foreground mt-1">Real-time performance metrics for Gateway Arch.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-background shadow-sm px-4 py-1.5 rounded-full border-primary/20 text-primary font-bold">
              Live Campaign
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Views', value: stats?.totalViews.toLocaleString(), icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Passport Saves', value: stats?.totalSaves.toLocaleString(), icon: BookmarkCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Referrals', value: stats?.referralsGenerated.toLocaleString(), icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Engagement', value: `${stats?.engagementScore}%`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-soft hover:shadow-lg transition-all group overflow-hidden">
              <CardContent className="p-6 relative">
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-[4rem] -mr-8 -mt-8 opacity-40 group-hover:scale-110 transition-transform`} />
                <div className="flex flex-col gap-4 relative z-10">
                  <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-display font-bold">{stat.value}</h3>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3" /> +12%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-soft overflow-hidden rounded-3xl bg-card">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg font-display font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Engagement Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series}>
                    <defs>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-soft overflow-hidden rounded-3xl bg-slate-900 text-white">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-lg font-display font-bold">Recent Passport Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[
                { user: 'Explorer A', time: '2m ago', action: 'Saved to Passport' },
                { user: 'Explorer B', time: '15m ago', action: 'Verified Check-in' },
                { user: 'Explorer C', time: '1h ago', action: 'Shared to Social' },
                { user: 'Explorer D', time: '2h ago', action: 'Saved to Passport' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                  <div>
                    <p className="text-sm font-bold">{activity.user}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">{activity.action}</p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-500">{activity.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}