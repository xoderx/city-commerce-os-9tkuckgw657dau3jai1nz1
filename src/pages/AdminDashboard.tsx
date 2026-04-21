import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShieldAlert, Map, Trophy, LayoutDashboard, Settings, Layers, Users, Palette, Globe, Save } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { SystemHeatmap, SystemStats, TenantConfig } from '@shared/types';
export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('analytics');
  const { data: heatmap } = useQuery({
    queryKey: ['admin-heatmap'],
    queryFn: () => api<SystemHeatmap[]>('/api/admin/heatmap')
  });
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api<SystemStats>('/api/admin/system-stats')
  });
  const { data: tenant } = useQuery({
    queryKey: ['tenant-config', 'st-louis'],
    queryFn: () => api<TenantConfig>('/api/tenant/st-louis')
  });
  const updateTenantMutation = useMutation({
    mutationFn: (updates: Partial<TenantConfig>) => api('/api/admin/tenant-config', {
      method: 'POST',
      body: JSON.stringify(updates)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-config'] });
      toast.success("Platform branding updated successfully!");
    }
  });
  const handleUpdateBranding = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates = {
      tagline: formData.get('tagline') as string,
      logoUrl: formData.get('logoUrl') as string,
      primaryColor: formData.get('primaryColor') as string,
      secondaryColor: formData.get('secondaryColor') as string,
    };
    updateTenantMutation.mutate(updates);
  };
  const COLORS = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED'];
  return (
    <AppLayout className="bg-slate-50/50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-bold tracking-tight">System Command</h1>
            <p className="text-muted-foreground">Monitoring the {tenant?.name || 'City'} digital economy.</p>
          </div>
          <div className="flex items-center gap-3">
             <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 px-3 py-1 font-bold animate-pulse">
               <ShieldAlert className="h-3 w-3 mr-2" /> 2 Alerts
             </Badge>
          </div>
        </div>
        <Tabs defaultValue="analytics" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-muted p-1 rounded-xl h-14">
            <TabsTrigger value="analytics" className="rounded-lg px-8 h-12 gap-2 text-sm font-bold">
              <LayoutDashboard className="h-4 w-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="cms" className="rounded-lg px-8 h-12 gap-2 text-sm font-bold">
              <Globe className="h-4 w-4" /> Platform Settings
            </TabsTrigger>
          </TabsList>
          <TabsContent value="analytics" className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Passport Ecosystem', value: stats?.totalUsers.toLocaleString() || '0', sub: 'Active Citizens', icon: Users, color: 'text-primary' },
                { label: 'Ecosystem Liquidity', value: stats?.totalPointsIssued.toLocaleString() || '0', sub: 'Points Issued', icon: Trophy, color: 'text-amber-500' },
                { label: 'Territory Coverage', value: '100%', sub: 'Districts Live', icon: Map, color: 'text-emerald-500' },
              ].map((item, i) => (
                <Card key={i} className="border-none shadow-soft rounded-[2rem] bg-card">
                  <CardContent className="p-8 flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                      <item.icon className={`h-8 w-8 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-display font-bold">{item.value}</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground/60">{item.sub}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-soft rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-2xl font-display font-bold">District Engagement Index</CardTitle>
                  <p className="text-sm text-muted-foreground">Cross-district activity comparison.</p>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={heatmap}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                        <XAxis dataKey="districtId" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none' }} />
                        <Bar dataKey="activityLevel" radius={[10, 10, 0, 0]}>
                          {heatmap?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-8">
                <Card className="border-none shadow-soft rounded-[2rem] bg-slate-900 text-white overflow-hidden">
                  <CardHeader className="p-8">
                    <CardTitle className="text-xl font-display font-bold">Loyalty Health</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 pt-0 space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                          <span>Rookie Badge rate</span>
                          <span className="text-primary">82%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[82%]" />
                        </div>
                      </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="cms">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-soft rounded-[2.5rem]">
                <CardHeader className="p-8">
                  <CardTitle className="text-2xl font-display font-bold">Multi-Tenant CMS</CardTitle>
                  <CardDescription>Update your city's branding and visual identity.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <form onSubmit={handleUpdateBranding} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Platform Tagline</label>
                        <Input name="tagline" defaultValue={tenant?.tagline} className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Logo URL</label>
                        <Input name="logoUrl" defaultValue={tenant?.logoUrl} className="rounded-xl h-12" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Palette className="h-3 w-3" /> Primary Color
                        </label>
                        <div className="flex gap-2">
                          <Input type="color" name="primaryColor" defaultValue={tenant?.primaryColor} className="w-12 h-12 p-1 rounded-lg cursor-pointer" />
                          <Input value={tenant?.primaryColor} readOnly className="flex-1 rounded-xl h-12 font-mono text-xs" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                          <Palette className="h-3 w-3" /> Secondary Color
                        </label>
                        <div className="flex gap-2">
                          <Input type="color" name="secondaryColor" defaultValue={tenant?.secondaryColor} className="w-12 h-12 p-1 rounded-lg cursor-pointer" />
                          <Input value={tenant?.secondaryColor} readOnly className="flex-1 rounded-xl h-12 font-mono text-xs" />
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button type="submit" disabled={updateTenantMutation.isPending} className="rounded-xl h-14 px-8 font-bold gap-2 shadow-lg shadow-primary/20">
                        {updateTenantMutation.isPending ? "Applying Changes..." : <><Save className="h-4 w-4" /> Save Configuration</>}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              <div className="space-y-8">
                <Card className="border-none shadow-soft rounded-[2rem] bg-primary text-primary-foreground">
                  <CardHeader>
                    <CardTitle className="text-lg font-display font-bold">Current Theme</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm opacity-90 leading-relaxed">
                      Your platform is currently using the <strong>{tenant?.themeVariant || 'light'}</strong> variant. Colors are injected via CSS variables for real-time reactivity.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}