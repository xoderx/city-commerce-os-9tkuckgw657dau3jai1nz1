import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, TrendingUp, Map, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlaceCard } from '@/components/ui/place-card';
import { SurpriseMeEngine } from '@/components/features/SurpriseMeEngine';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import type { Place, TenantConfig } from '@shared/types';
export function HomePage() {
  const { data: trendingPlaces, isLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => api<Place[]>('/api/places/trending')
  });
  const { data: tenant } = useQuery({
    queryKey: ['tenant-config', 'st-louis'],
    queryFn: () => api<TenantConfig>('/api/tenant/st-louis')
  });
  const themeStyles = useMemo(() => {
    if (!tenant) return {};
    return {
      '--primary': tenant.primaryColor,
      '--primary-foreground': '210 40% 98%',
    } as React.CSSProperties;
  }, [tenant]);
  return (
    <div className="min-h-screen flex flex-col bg-background" style={themeStyles}>
      <Navbar />
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={tenant?.heroImage || "https://images.unsplash.com/photo-1558281050-4c33200099c7?auto=format&fit=crop&q=80&w=2000"}
            alt="Hero Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/20">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Official Destination Marketplace</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white leading-[1.1]">
              {tenant?.tagline?.split(' ').slice(0, 2).join(' ') || 'Gateway to'} <br /> 
              <span className="text-primary italic">{tenant?.tagline?.split(' ').slice(2).join(' ') || 'Adventure.'}</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-lg leading-relaxed">
              Explore soulful districts, legendary landmarks, and curated experiences in {tenant?.name || 'the city'}.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <SurpriseMeEngine />
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm px-8 rounded-full h-[60px] text-lg">
                View District Map
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Quick Stats / Trust */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white dark:bg-slate-900 border border-border shadow-2xl rounded-3xl overflow-hidden">
          {[
            { label: 'Experiences', value: '250+', icon: Map },
            { label: 'Avg Rating', value: '4.8', icon: Star },
            { label: 'Points Earned', value: '1M+', icon: TrendingUp },
            { label: 'Verified', value: '100%', icon: ShieldCheck },
          ].map((stat, i) => (
            <div key={i} className="p-6 flex flex-col items-center text-center border-r last:border-none border-border group hover:bg-primary/5 transition-colors">
              <stat.icon className="h-6 w-6 mb-3 text-primary group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-bold font-display">{stat.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Trending Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl font-display font-bold">Trending in {tenant?.name || 'the city'}</h2>
              <p className="text-muted-foreground text-lg max-w-xl">
                The most visited and highest rated experiences this week.
              </p>
            </div>
            <Button variant="ghost" className="group text-lg" asChild>
              <Link to="/explore" className="flex items-center">
                View all attractions <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {trendingPlaces?.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Passport Teaser */}
      <section className="py-20 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 items-center gap-16">
            <div className="space-y-8">
              <div className="inline-block bg-primary px-4 py-1.5 rounded-full text-xs font-bold text-white uppercase tracking-widest">
                City Passport
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                Your journey, <br /> beautifully <span className="text-primary">rewarded.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Unlock exclusive digital badges, earn points for every visit, and turn your adventure into a legendary digital memory.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10 rounded-full h-[56px] text-lg font-bold" asChild>
                <Link to="/passport">Create My Passport</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-slate-800 to-slate-950 p-8 shadow-2xl border border-slate-800 relative overflow-hidden group">
                 <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                       <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
                          <TrendingUp className="text-white" />
                       </div>
                       <div className="text-right text-white">
                          <div className="text-slate-400 text-xs uppercase tracking-wider font-bold">Live Rewards</div>
                          <div className="text-3xl font-display font-bold">1,240 <span className="text-primary text-sm font-sans uppercase tracking-widest">pts</span></div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-white">
                          <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-xs">⭐</div>
                             <div className="text-xs font-bold">Premium Experience Check-in</div>
                          </div>
                          <div className="text-xs font-bold text-primary">+100 pts</div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
import { Link } from 'react-router-dom';