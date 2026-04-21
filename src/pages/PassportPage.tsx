import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, MapPin, History, Star, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import type { User, Place } from '@shared/types';
export function PassportPage() {
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => api<User>('/api/user/profile')
  });
  const { data: places } = useQuery({
    queryKey: ['places'],
    queryFn: () => api<Place[]>('/api/places')
  });
  const savedItems = places?.filter(p => user?.savedPlaces.includes(p.id)) || [];
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-24">
        {/* Profile Header */}
        <section className="bg-slate-900 text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-4xl font-display font-bold border-4 border-slate-800 shadow-xl">
                  {user?.name?.[0]}
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-amber-500 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg">
                  <Trophy className="h-5 w-5 text-slate-900" />
                </div>
              </div>
              <div className="text-center md:text-left space-y-2">
                <h1 className="text-3xl md:text-5xl font-display font-bold">{user?.name}</h1>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Member since 2024</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-bold text-white">Advanced Explorer</span>
                  </div>
                </div>
              </div>
              <div className="flex-grow" />
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-display font-bold text-primary">{user?.points}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Total Points</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-display font-bold text-white">{user?.badges.length}</div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Badges</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        {/* Passport Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Tabs defaultValue="badges" className="space-y-8">
            <TabsList className="bg-muted p-1 rounded-xl h-14">
              <TabsTrigger value="badges" className="rounded-lg px-8 h-12 gap-2 text-sm font-bold">
                <Trophy className="h-4 w-4" /> My Badges
              </TabsTrigger>
              <TabsTrigger value="saved" className="rounded-lg px-8 h-12 gap-2 text-sm font-bold">
                <MapPin className="h-4 w-4" /> Saved Places
              </TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-lg px-8 h-12 gap-2 text-sm font-bold">
                <History className="h-4 w-4" /> Memory Timeline
              </TabsTrigger>
            </TabsList>
            <TabsContent value="badges">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {['Gateway Rookie', 'BBQ King', 'Riverfront Rider', 'Museum Maven', 'Park Pro', 'Night Owl'].map((name, i) => (
                  <div key={i} className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${i < (user?.badges.length || 0) ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-dashed border-muted'}`}>
                    <div className={`h-16 w-16 rounded-full mb-4 flex items-center justify-center text-3xl shadow-sm ${i < (user?.badges.length || 0) ? 'bg-white grayscale-0' : 'bg-slate-200 grayscale opacity-40'}`}>
                      {['🏆', '🍖', '🚲', '🖼️', '🌳', '🌃'][i]}
                    </div>
                    <div className={`text-xs font-bold text-center ${i < (user?.badges.length || 0) ? 'text-primary' : 'text-muted-foreground'}`}>{name}</div>
                    {i >= (user?.badges.length || 0) && <div className="text-[10px] text-muted-foreground mt-1">Locked</div>}
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="saved">
              {savedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {savedItems.map(place => (
                    <Card key={place.id} className="overflow-hidden group hover:shadow-lg transition-all">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                        <Badge className="absolute top-3 right-3 bg-white/90 text-black">{place.district}</Badge>
                      </div>
                      <CardContent className="p-5 flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-lg">{place.name}</h4>
                          <p className="text-xs text-muted-foreground">{place.address}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:text-primary">
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center border-2 border-dashed rounded-3xl">
                  <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-bold text-lg">No saved places yet</h3>
                  <p className="text-muted-foreground">Start exploring to build your personalized travel hub.</p>
                  <Button variant="outline" className="mt-6" asChild>
                    <a href="/explore">Browse Attractions</a>
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="timeline">
              <div className="max-w-2xl mx-auto space-y-12 py-8">
                {[
                  { date: 'Today, 10:15 AM', event: 'Checked into Gateway Arch', points: '+50' },
                  { date: 'Yesterday, 6:45 PM', event: 'Unlocked "BBQ King" Badge', points: '+150' },
                  { date: 'Oct 12, 1:20 PM', event: 'Saved Forest Park to Passport', points: '+10' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 relative group">
                    {i < 2 && <div className="absolute left-[27px] top-10 bottom-[-48px] w-0.5 bg-slate-100" />}
                    <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border-4 border-background group-hover:bg-primary/10 transition-colors">
                      <History className="h-6 w-6 text-slate-500 group-hover:text-primary" />
                    </div>
                    <div className="pt-2 flex-grow">
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.date}</div>
                      <h4 className="font-bold text-lg">{item.event}</h4>
                      <Badge variant="secondary" className="mt-2 text-primary font-bold">{item.points} pts</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}