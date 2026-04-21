import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, User as UserIcon, Compass, Menu, Trophy, LayoutDashboard, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api-client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { User, TenantConfig } from '@shared/types';
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { data: user } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => api<User>('/api/user/profile'),
    retry: false
  });
  const { data: tenant } = useQuery({
    queryKey: ['tenant-config', 'st-louis'],
    queryFn: () => api<TenantConfig>('/api/tenant/st-louis')
  });
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const isDarkNav = location.pathname === '/' && !isScrolled;
  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      isScrolled
        ? "bg-background/80 backdrop-blur-md py-2 border-border shadow-sm"
        : "bg-transparent py-4 border-transparent",
      isDarkNav ? "text-white" : "text-foreground"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12",
                isDarkNav ? "bg-white text-slate-900" : "bg-primary text-primary-foreground"
              )}>
                <Compass className="h-5 w-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:block uppercase">
                {tenant?.name?.split(' ')?.[0] || 'Explore'}
                <span className={isDarkNav ? "text-white" : "text-primary"}>
                  {tenant?.name?.split(' ')?.[1] || 'Stl'}
                </span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/explore" className="text-sm font-bold hover:text-primary transition-colors">Attractions</Link>
              <Link to="/explore" className="text-sm font-bold hover:text-primary transition-colors">Districts</Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-sm font-bold hover:text-primary transition-colors flex items-center gap-1 focus:outline-none">
                    Portals <BarChart2 className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 rounded-xl border-border shadow-xl p-1 bg-popover">
                  <DropdownMenuItem asChild className="font-bold py-2.5 cursor-pointer">
                    <Link to="/dashboard/partner" className="flex items-center gap-2">
                      <BarChart2 className="h-4 w-4 text-primary" /> Partner Login
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="font-bold py-2.5 cursor-pointer">
                    <Link to="/dashboard/admin" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4 text-primary" /> City Admin
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className={cn("hidden sm:inline-flex", isDarkNav && "hover:bg-white/10 text-white")}>
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle className="static" />
            {user?.points !== undefined && (
               <div className="hidden sm:flex items-center bg-muted/20 backdrop-blur-sm rounded-full pl-1 pr-4 py-1 border border-border/10 ml-2">
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center mr-2 shadow-sm">
                    <Trophy className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-xs font-bold">{user.points} <span className="opacity-60">PTS</span></span>
               </div>
            )}
            <Button asChild variant={isDarkNav ? "outline" : "default"} className={cn(
              "hidden sm:flex gap-2 ml-2 rounded-full font-bold h-10",
              isDarkNav && "bg-white/10 border-white/20 text-white hover:bg-white/20"
            )}>
              <Link to="/passport">
                <UserIcon className="h-4 w-4" />
                Passport
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}