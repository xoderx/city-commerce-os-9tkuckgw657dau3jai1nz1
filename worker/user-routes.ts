import { Hono } from "hono";
import type { Env } from './core-utils';
import { TenantEntity, PlaceEntity, UserEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import { PLACES, DISTRICTS, PARTNER_METRICS, MOCK_ANALYTICS_SERIES, DISTRICT_HEATMAP_DATA, ST_LOUIS_TENANT } from "@shared/mock-data";
import type { SystemStats, UpdateTenantRequest } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // TENANT CMS
  app.get('/api/tenant/:slug', async (c) => {
    await TenantEntity.ensureSeed(c.env);
    const { items } = await TenantEntity.list(c.env);
    const tenant = items.find(t => t.slug === c.req.param('slug'));
    return tenant ? ok(c, tenant) : ok(c, ST_LOUIS_TENANT);
  });
  app.post('/api/admin/tenant-config', async (c) => {
    const body = await c.req.json<UpdateTenantRequest>();
    const tenant = new TenantEntity(c.env, 't-stl');
    const current = await tenant.getState();
    const updated = { ...current, ...body };
    await tenant.save(updated);
    return ok(c, updated);
  });
  app.get('/api/districts', async (c) => ok(c, DISTRICTS));
  app.get('/api/places', async (c) => {
    await PlaceEntity.ensureSeed(c.env);
    const { items } = await PlaceEntity.list(c.env);
    return ok(c, items);
  });
  app.get('/api/places/trending', async (c) => {
    await PlaceEntity.ensureSeed(c.env);
    const { items } = await PlaceEntity.list(c.env);
    return ok(c, items.filter(p => p.isTrending));
  });
  // ANALYTICS & DASHBOARD
  app.get('/api/partner/stats/:placeId', async (c) => {
    const stats = PARTNER_METRICS.find(s => s.placeId === c.req.param('placeId'));
    return stats ? ok(c, { stats, series: MOCK_ANALYTICS_SERIES }) : notFound(c);
  });
  app.get('/api/admin/system-stats', async (c) => {
    const stats: SystemStats = {
      totalUsers: 1450,
      totalPointsIssued: 450000,
      trendingDistricts: ['Downtown', 'Soulard'],
      engagementSeries: MOCK_ANALYTICS_SERIES
    };
    return ok(c, stats);
  });
  app.get('/api/admin/heatmap', async (c) => ok(c, DISTRICT_HEATMAP_DATA));
  app.get('/api/user/profile', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const user = new UserEntity(c.env, 'u-1');
    return ok(c, await user.getState());
  });
  app.post('/api/user/add-points', async (c) => {
    const { amount } = await c.req.json();
    const user = new UserEntity(c.env, 'u-1');
    const next = await user.mutate(s => ({ ...s, points: s.points + (amount || 0) }));
    return ok(c, next);
  });
  app.post('/api/user/save-place', async (c) => {
    const { placeId } = await c.req.json();
    const user = new UserEntity(c.env, 'u-1');
    const next = await user.mutate(s => {
      if (s.savedPlaces.includes(placeId)) return s;
      return { ...s, savedPlaces: [...s.savedPlaces, placeId] };
    });
    return ok(c, next);
  });
  app.post('/api/surprise', async (c) => {
    const { vibe } = await c.req.json();
    const filtered = PLACES.filter(p => vibe === 'Foodie' ? p.categoryId === 'cat-2' : true);
    return ok(c, { 
      title: `${vibe} Day`, 
      stops: filtered.slice(0, 3).map((p, i) => ({ 
        time: `${10+i}:00 AM`, 
        place: p 
      })) 
    });
  });
}