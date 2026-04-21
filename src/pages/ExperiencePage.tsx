import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Star, MapPin, Clock, Bus, Train, Bike,
  ShieldCheck, ExternalLink, Bookmark, Share2, Info, CheckCircle2, Accessibility
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { Place, User } from '@shared/types';
export function ExperiencePage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [transitTimes, setTransitTimes] = useState<Record<number, string>>({
    0: '5 min',
    1: '12 min',
    2: '3 available'
  });
  const { data: place, isLoading } = useQuery({
    queryKey: ['place', id],
    queryFn: async () => {
      const items = await api<Place[]>(`/api/places`);
      return items.find(p => p.id === id);
    }
  });
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => api<User>('/api/user/profile')
  });
  const saveMutation = useMutation({
    mutationFn: (placeId: string) => api('/api/user/save-place', {
      method: 'POST',
      body: JSON.stringify({ placeId })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success("Saved to your City Passport!");
    }
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setTransitTimes(prev => ({
        ...prev,
        0: `${Math.floor(Math.random() * 8) + 1} min`,
        1: `${Math.floor(Math.random() * 15) + 5} min`
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-24 space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="aspect-video w-full rounded-3xl" />
      </div>
    </div>
  );
  if (!place) return <div className="min-h-screen flex items-center justify-center">Place not found</div>;
  const isSaved = user?.savedPlaces.includes(place.id);
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to="/explore">Explore</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{place.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
            <div className="space-y-8">
              <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl relative group">
                <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 uppercase tracking-widest text-[10px] font-bold border-none">
                    {place.district}
                  </Badge>
                  {place.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="px-3 py-1 font-medium bg-background/50">#{tag}</Badge>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight tracking-tight">{place.name}</h1>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isSaved ? "default" : "outline"}
                      className="rounded-full gap-2 font-bold px-6 h-12"
                      onClick={() => !isSaved && saveMutation.mutate(place.id)}
                      disabled={saveMutation.isPending || isSaved}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
                      {isSaved ? "Saved" : "Save to Passport"}
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><Share2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    {place.rating} <span className="text-muted-foreground font-normal">({place.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{place.address}</div>
                </div>
                <Separator />
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold font-display">Experience Details</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {place.description} Experience the magic of this destination. Verified partner of City Commerce OS.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold font-display">Accessibility & Services</h3>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Accessibility className="h-4 w-4 text-emerald-500" /> Wheelchair Accessible
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Public Transit Near
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <aside className="lg:sticky lg:top-28 space-y-6">
              <Card className="shadow-2xl border-none overflow-hidden rounded-[2rem] bg-card">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Passport Rewards</div>
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="flex flex-col">
                        <span className="text-base font-bold">Visit & Check-in</span>
                        <span className="text-xs text-muted-foreground">Nearby verification required</span>
                      </div>
                      <Badge className="bg-primary text-white font-bold">+50 PTS</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Smart Mobility</div>
                       <Badge variant="outline" className="text-[10px] animate-pulse border-green-500/50 text-green-600">Live</Badge>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: 'Bus Route 4', icon: Bus, color: 'text-blue-500' },
                        { name: 'MetroLink Red', icon: Train, color: 'text-red-500' },
                        { name: 'Scooter / Bike', icon: Bike, color: 'text-green-500' },
                      ].map((m, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-2xl border bg-background/50 hover:bg-accent transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <m.icon className={`h-5 w-5 ${m.color}`} />
                            <span className="text-sm font-bold">{m.name}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-muted-foreground">{transitTimes[i]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3 pt-4">
                    <Button className="w-full h-14 rounded-2xl font-bold gap-2">
                      Get Directions <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-bold" onClick={() => toast.success("Redirecting to partner portal...")}>
                      Book via Partner
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}