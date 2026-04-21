import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Map as MapIcon, SlidersHorizontal, ChevronDown, LayoutGrid } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PlaceCard } from '@/components/ui/place-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';
import { DistrictMap } from '@/components/features/DistrictMap';
import { cn } from '@/lib/utils';
import type { Place } from '@shared/types';
import { CATEGORIES, DISTRICTS } from '@shared/mock-data';
export function ExplorerHub() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const { data: places, isLoading } = useQuery({
    queryKey: ['places'],
    queryFn: () => api<Place[]>('/api/places')
  });
  const filteredPlaces = places?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         p.district.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;
    const districtData = DISTRICTS.find(d => d.id === selectedDistrict);
    const matchesDistrict = !selectedDistrict || p.district === districtData?.name;
    return matchesSearch && matchesCategory && matchesDistrict;
  });
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight">Explorer Hub</h1>
              <p className="text-muted-foreground text-lg max-w-xl">
                Deep dive into St. Louis. From the historic Soulard to the bustling Central West End.
              </p>
            </div>
            <div className="flex items-center bg-muted/50 p-1.5 rounded-2xl border border-border shadow-sm self-start md:self-auto">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "rounded-xl gap-2 h-10 px-6 font-bold transition-all",
                  viewMode === 'grid' && "shadow-md"
                )}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" /> Grid
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                className={cn(
                  "rounded-xl gap-2 h-10 px-6 font-bold transition-all",
                  viewMode === 'map' && "shadow-md"
                )}
                onClick={() => setViewMode('map')}
              >
                <MapIcon className="h-4 w-4" /> Map
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 items-start">
            <aside className="hidden lg:block space-y-10 sticky top-32 self-start bg-card/30 p-6 rounded-3xl border border-border/50 backdrop-blur-sm">
              <div className="space-y-5">
                <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">Search</h3>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    placeholder="Attractions, dining..."
                    className="pl-11 h-12 rounded-2xl bg-secondary/50 border-border/50 focus:bg-background transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-5">
                <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">Categories</h3>
                <div className="flex flex-col gap-1.5">
                  <Button
                    variant={selectedCategory === null ? "secondary" : "ghost"}
                    className="justify-start font-bold h-11 rounded-xl px-4"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Experiences
                  </Button>
                  {CATEGORIES.map(cat => (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? "secondary" : "ghost"}
                      className="justify-start font-bold h-11 rounded-xl px-4"
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground/80">Districts</h3>
                  {selectedDistrict && (
                    <button onClick={() => setSelectedDistrict(null)} className="text-[10px] font-bold text-primary hover:underline">Clear</button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {DISTRICTS.map(dist => (
                    <button
                      key={dist.id}
                      onClick={() => setSelectedDistrict(selectedDistrict === dist.id ? null : dist.id)}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-xl border text-sm font-bold transition-all",
                        selectedDistrict === dist.id
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                          : "bg-background border-border/50 hover:border-primary/30"
                      )}
                    >
                      {dist.name}
                      {selectedDistrict === dist.id && <MapIcon className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
            <div className="min-h-[600px]">
              <AnimatePresence mode="wait">
                {viewMode === 'map' ? (
                  <motion.div 
                    key="map-view"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="space-y-10"
                  >
                    <DistrictMap
                      selectedDistrict={selectedDistrict}
                      onSelectDistrict={setSelectedDistrict}
                    />
                    <div className="space-y-6">
                      <h2 className="text-2xl font-display font-bold">
                        {selectedDistrict
                          ? `Results in ${DISTRICTS.find(d => d.id === selectedDistrict)?.name}`
                          : 'Explore all locations'}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredPlaces?.map((place) => (
                          <PlaceCard key={place.id} place={place} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="grid-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-muted-foreground">
                        Displaying <span className="text-foreground font-bold">{filteredPlaces?.length || 0}</span> curated experiences
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs gap-2 font-bold h-9">
                        Sort by: Trending <ChevronDown className="h-3 w-3" />
                      </Button>
                    </div>
                    {isLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-[2rem]" />
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredPlaces?.map((place) => (
                          <PlaceCard key={place.id} place={place} />
                        ))}
                      </div>
                    )}
                    {!isLoading && filteredPlaces?.length === 0 && (
                      <div className="py-24 text-center border-2 border-dashed rounded-[2.5rem] bg-secondary/20">
                        <div className="h-16 w-16 bg-background rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft">
                          <Search className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <h3 className="font-display font-bold text-2xl">No experiences found</h3>
                        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Try broadening your search or choosing a different district.</p>
                        <Button
                          variant="link"
                          className="mt-6 text-primary font-bold"
                          onClick={() => { setSearch(""); setSelectedCategory(null); setSelectedDistrict(null); }}
                        >
                          Clear all search filters
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}