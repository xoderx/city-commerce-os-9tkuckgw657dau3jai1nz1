import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Check, MapPin, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
export function SurpriseMeEngine() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [selection, setSelection] = useState({ vibe: 'Adventure' });
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: () => api('/api/user/add-points', {
      method: 'POST',
      body: JSON.stringify({ amount: 100 })
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast.success("Itinerary saved! +100 bonus points granted.");
    }
  });
  const generate = async () => {
    setLoading(true);
    try {
      const data = await api<any>('/api/surprise', {
        method: 'POST',
        body: JSON.stringify(selection)
      });
      setItinerary(data);
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const vibes = [
    { name: 'Adventure', icon: '🧗', desc: 'Action-packed and high energy' },
    { name: 'Relax', icon: '🧘', desc: 'Chill vibes and slow mornings' },
    { name: 'Foodie', icon: '🍱', desc: 'Best local eats and treats' }
  ];
  return (
    <Dialog onOpenChange={(open) => !open && setStep(1)}>
      <DialogTrigger asChild>
        <Button size="lg" className="btn-gradient px-8 py-6 rounded-full shadow-lg text-lg">
          <Sparkles className="mr-2 h-5 w-5" /> Surprise Me
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold">Surprise Experience Engine</DialogTitle>
        </DialogHeader>
        <div className="py-6 min-h-[350px] flex flex-col">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-muted-foreground mb-6">Choose your vibe for today's adventure.</p>
                <div className="grid gap-3">
                  {vibes.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => {
                        setSelection({ ...selection, vibe: v.name });
                        setStep(2);
                      }}
                      className="flex items-center p-4 border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group text-left"
                    >
                      <span className="text-3xl mr-4">{v.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold">{v.name}</div>
                        <div className="text-xs text-muted-foreground">{v.desc}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center justify-center flex-1 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary floating" />
                </div>
                <h3 className="text-xl font-bold">Ready for your {selection.vibe} day?</h3>
                <p className="text-muted-foreground">We've curated a custom itinerary based on real-time city data.</p>
                <Button onClick={generate} disabled={loading} className="w-full h-12 text-lg">
                  {loading ? "Calculating..." : "Reveal My Plan"}
                </Button>
              </motion.div>
            )}
            {step === 3 && itinerary && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    <Check className="h-5 w-5" /> Itinerary Ready!
                  </h3>
                  <p className="text-sm font-medium mt-1">{itinerary.title}</p>
                </div>
                <div className="space-y-4">
                  {itinerary.stops.map((stop: any, idx: number) => (
                    <Link key={idx} to={`/place/${stop.place.id}`} className="block">
                      <div className="flex gap-4 group hover:bg-accent/50 p-2 rounded-xl transition-colors">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                            {idx + 1}
                          </div>
                          {idx < itinerary.stops.length - 1 && (
                            <div className="w-px flex-1 bg-slate-200 my-1" />
                          )}
                        </div>
                        <div className="pb-4">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Clock className="h-3 w-3" /> {stop.time}
                          </div>
                          <h4 className="font-bold group-hover:text-primary transition-colors">{stop.place.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" /> {stop.place.district}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Button 
                  className="w-full h-12" 
                  variant="default"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isSuccess ? "Saved to Passport" : "Save Itinerary & Earn Points"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}