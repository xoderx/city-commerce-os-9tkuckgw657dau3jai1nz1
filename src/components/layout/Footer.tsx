import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <h3 className="text-white font-display font-bold text-xl">EXPLORESTL</h3>
            <p className="text-sm leading-relaxed max-w-xs">
              The official destination platform for St. Louis. Experience the best the Gateway City has to offer.
            </p>
            <div className="flex gap-4">
              <Facebook className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Top Attractions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Local Dining</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hidden Gems</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Itineraries</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6">Partners</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">For Businesses</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DMO Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Advertising</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partner Login</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-white font-semibold">Join Our Newsletter</h4>
            <p className="text-sm">Get the latest events and deals delivered to your inbox.</p>
            <div className="flex gap-2">
              <Input placeholder="Email address" className="bg-slate-800 border-slate-700 text-white" />
              <Button size="icon" className="shrink-0 bg-primary hover:bg-primary/90">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2024 City Commerce OS. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Accessibility Statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}