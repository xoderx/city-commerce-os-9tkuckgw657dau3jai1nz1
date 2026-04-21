import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Bookmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { Place, User } from '@shared/types';
import { cn } from '@/lib/utils';
interface PlaceCardProps {
  place: Place;
}
export function PlaceCard({ place }: PlaceCardProps) {
  const queryClient = useQueryClient();
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
      toast.success("Added to Passport!");
    }
  });
  const isSaved = user?.savedPlaces.includes(place.id);
  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSaved) {
      saveMutation.mutate(place.id);
    }
  };
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/place/${place.id}`}>
        <Card className="overflow-hidden border-none shadow-soft hover:shadow-xl transition-all duration-300 h-full group bg-card">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={place.imageUrl}
              alt={place.name}
              className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge className="bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm border-none shadow-sm font-bold">
                {place.district}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleBookmark}
                className={cn(
                  "h-8 w-8 rounded-full backdrop-blur-sm transition-all",
                  isSaved ? "bg-primary text-white" : "bg-white/90 text-slate-900 hover:scale-110"
                )}
              >
                <Bookmark className={cn("h-4 w-4", isSaved && "fill-white")} />
              </Button>
            </div>
            <div className="absolute bottom-3 right-3">
               <div className="bg-white/90 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                  {place.rating}
               </div>
            </div>
          </div>
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-1 mb-2">
              {place.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
                  #{tag}
                </span>
              ))}
            </div>
            <h3 className="font-display font-bold text-lg leading-snug group-hover:text-primary transition-colors">
              {place.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
              {place.description}
            </p>
            <div className="flex items-center gap-1 mt-4 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{place.address}</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}