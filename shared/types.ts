export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heroImage: string;
  tagline: string;
  themeVariant: 'light' | 'dark' | 'system';
}
export interface UpdateTenantRequest {
  name?: string;
  tagline?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  themeVariant?: 'light' | 'dark' | 'system';
}
export interface Category {
  id: string;
  name: string;
  icon: string;
}
export interface District {
  id: string;
  name: string;
  description: string;
  color: string;
  stats: {
    attractions: number;
    dining: number;
  };
}
export interface TransitOption {
  type: 'Bus' | 'Train' | 'Bike';
  route: string;
  eta: string;
  status: string;
}
export interface Place {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  address: string;
  district: string;
  tags: string[];
  isTrending?: boolean;
}
export interface AnalyticsMetric {
  timestamp: string;
  value: number;
  label: string;
}
export interface SystemStats {
  totalUsers: number;
  totalPointsIssued: number;
  trendingDistricts: string[];
  engagementSeries: AnalyticsMetric[];
}
export interface PartnerStats {
  placeId: string;
  totalViews: number;
  totalSaves: number;
  referralsGenerated: number;
  engagementScore: number;
}
export interface SystemHeatmap {
  districtId: string;
  activityLevel: number;
  topCategory: string;
}
export interface Offer {
  id: string;
  placeId: string;
  title: string;
  description: string;
  discountValue: string;
  expiryDate: string;
}
export interface Badge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  pointsValue: number;
}
export interface ItineraryRequest {
  vibe: 'Adventure' | 'Relax' | 'Foodie' | 'Family';
  groupSize: number;
  duration: 'Morning' | 'Afternoon' | 'Full Day';
}
export interface User {
  id: string;
  name: string;
  points: number;
  badges: string[];
  savedPlaces: string[];
  role?: 'citizen' | 'partner' | 'admin';
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}