import type { User, Place, Category, TenantConfig, District, AnalyticsMetric, PartnerStats, SystemHeatmap } from './types';
export const ST_LOUIS_TENANT: TenantConfig = {
  id: 't-stl',
  slug: 'st-louis',
  name: 'Explore St. Louis',
  logoUrl: 'https://explorestlouis.com/wp-content/themes/explorestlouis/assets/img/logo-white.svg',
  primaryColor: '#0F172A',
  secondaryColor: '#2563EB',
  heroImage: 'https://images.unsplash.com/photo-1558281050-4c33200099c7?auto=format&fit=crop&q=80&w=2000',
  tagline: 'Discover the Gateway to the West'
};
export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Attractions', icon: 'MapPin' },
  { id: 'cat-2', name: 'Dining', icon: 'Utensils' },
  { id: 'cat-3', name: 'Hotels', icon: 'Hotel' },
  { id: 'cat-4', name: 'Nightlife', icon: 'Music' }
];
export const DISTRICTS: District[] = [
  { id: 'stl-downtown', name: 'Downtown', description: 'The heart of the city.', color: '#2563EB', stats: { attractions: 15, dining: 45 } },
  { id: 'stl-cwe', name: 'Central West End', description: 'Sophisticated sidewalk cafes.', color: '#059669', stats: { attractions: 8, dining: 32 } },
  { id: 'stl-midtown', name: 'Midtown', description: 'Arts and entertainment hub.', color: '#D97706', stats: { attractions: 6, dining: 18 } },
  { id: 'stl-soulard', name: 'Soulard', description: 'Historic French neighborhood.', color: '#DC2626', stats: { attractions: 4, dining: 28 } },
  { id: 'stl-loop', name: 'The Loop', description: 'Vibrant entertainment district.', color: '#7C3AED', stats: { attractions: 5, dining: 40 } }
];
export const PLACES: Place[] = [
  { id: 'p-1', name: 'Gateway Arch', description: 'Iconic 630-foot monument.', categoryId: 'cat-1', imageUrl: 'https://images.unsplash.com/photo-1558281050-4c33200099c7?auto=format&fit=crop&q=80&w=800', rating: 4.8, reviewCount: 12450, address: '11 N 4th St, St. Louis, MO 63102', district: 'Downtown', tags: ['Landmark', 'Views'], isTrending: true },
  { id: 'p-2', name: 'City Museum', description: 'Industrial playground.', categoryId: 'cat-1', imageUrl: 'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&q=80&w=800', rating: 4.9, reviewCount: 8900, address: '750 N 16th St, St. Louis, MO 63103', district: 'Downtown', tags: ['Family', 'Adventure'], isTrending: true }
];
export const MOCK_ANALYTICS_SERIES: AnalyticsMetric[] = [
  { timestamp: '2024-01-01', value: 450, label: 'Jan' },
  { timestamp: '2024-01-08', value: 890, label: 'Jan' },
  { timestamp: '2024-01-15', value: 1200, label: 'Jan' },
  { timestamp: '2024-01-22', value: 1540, label: 'Jan' },
  { timestamp: '2024-02-01', value: 2100, label: 'Feb' },
  { timestamp: '2024-02-08', value: 1800, label: 'Feb' },
  { timestamp: '2024-02-15', value: 2450, label: 'Feb' },
];
export const PARTNER_METRICS: PartnerStats[] = [
  { placeId: 'p-1', totalViews: 12400, totalSaves: 3400, referralsGenerated: 850, engagementScore: 92 },
  { placeId: 'p-2', totalViews: 9800, totalSaves: 2100, referralsGenerated: 620, engagementScore: 88 },
];
export const DISTRICT_HEATMAP_DATA: SystemHeatmap[] = [
  { districtId: 'stl-downtown', activityLevel: 95, topCategory: 'Attractions' },
  { districtId: 'stl-cwe', activityLevel: 72, topCategory: 'Dining' },
  { districtId: 'stl-soulard', activityLevel: 58, topCategory: 'Nightlife' },
  { districtId: 'stl-midtown', activityLevel: 45, topCategory: 'Arts' },
  { districtId: 'stl-loop', activityLevel: 64, topCategory: 'Shopping' },
];
export const MOCK_USERS: User[] = [
  { id: 'u-1', name: 'Alex Explorer', points: 450, badges: ['b-1'], savedPlaces: ['p-1'], role: 'citizen' }
];