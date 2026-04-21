import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MapPin, ArrowRight, Activity, Users, Star } from 'lucide-react';
import { DISTRICTS } from '@shared/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
interface DistrictMapProps {
  onSelectDistrict: (id: string | null) => void;
  selectedDistrict: string | null;
}
export function DistrictMap({ onSelectDistrict, selectedDistrict }: DistrictMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const districts = [
    { id: 'stl-downtown', name: 'Downtown', path: 'M140,140 L260,140 L260,260 L140,260 Z', center: { x: 200, y: 200 } },
    { id: 'stl-cwe', name: 'Central West End', path: 'M20,100 L140,100 L140,180 L20,180 Z', center: { x: 80, y: 140 } },
    { id: 'stl-midtown', name: 'Midtown', path: 'M140,20 L260,20 L260,140 L140,140 Z', center: { x: 200, y: 80 } },
    { id: 'stl-soulard', name: 'Soulard', path: 'M140,260 L260,260 L260,380 L140,380 Z', center: { x: 200, y: 320 } },
    { id: 'stl-loop', name: 'The Loop', path: 'M20,20 L140,20 L140,100 L20,100 Z', center: { x: 80, y: 60 } },
  ];
  const hoveredData = hovered ? DISTRICTS.find(d => d.id === hovered) : null;
  return (
    <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-border shadow-inner overflow-hidden p-8">
      <div className="absolute top-6 left-6 z-10 space-y-1">
        <h3 className="text-lg font-display font-bold">St. Louis District Explorer</h3>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Select a district to filter</p>
      </div>
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-2xl"
      >
        <g transform="translate(50, 0)">
          {districts.map((d) => (
            <motion.path
              key={d.id}
              d={d.path}
              initial={false}
              animate={{
                fill: selectedDistrict === d.id 
                  ? 'hsl(var(--primary))' 
                  : hovered === d.id 
                    ? 'hsl(var(--primary) / 0.15)' 
                    : 'var(--card, white)',
                stroke: selectedDistrict === d.id ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                scale: hovered === d.id || selectedDistrict === d.id ? 1.05 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="cursor-pointer transition-colors"
              onClick={() => onSelectDistrict(selectedDistrict === d.id ? null : d.id)}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          ))}
          {districts.map((d) => (
            <text
              key={`${d.id}-label`}
              x={d.center.x}
              y={d.center.y}
              textAnchor="middle"
              className={cn(
                "text-[10px] font-bold uppercase pointer-events-none transition-colors duration-300",
                selectedDistrict === d.id ? "fill-white" : "fill-slate-500"
              )}
            >
              {d.name.split(' ')[0]}
            </text>
          ))}
        </g>
      </svg>
      <AnimatePresence>
        {hoveredData && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, delay: 0.05 }}
            className="absolute bottom-6 right-6 left-6 md:left-auto md:w-72 bg-background/95 backdrop-blur-md border border-border shadow-2xl p-5 rounded-2xl z-20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">{hoveredData.name}</h4>
                <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
                  <Activity className="h-3 w-3" /> Trending District
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
              {hoveredData.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                <Badge variant="secondary" className="text-[9px] px-2 py-0 gap-1">
                  <Users className="h-2.5 w-2.5" /> {hoveredData.stats.dining}+ Spots
                </Badge>
                <Badge variant="secondary" className="text-[9px] px-2 py-0 gap-1">
                  <Star className="h-2.5 w-2.5" /> {hoveredData.stats.attractions}+ Deals
                </Badge>
              </div>
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute bottom-6 left-6 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-full bg-background/50 backdrop-blur-sm border-border shadow-sm text-xs font-bold"
          onClick={() => onSelectDistrict(null)}
        >
          Reset Map View
        </Button>
      </div>
    </div>
  );
}