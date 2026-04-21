import { IndexedEntity } from "./core-utils";
import type { User, Place, TenantConfig } from "@shared/types";
import { MOCK_USERS, PLACES, ST_LOUIS_TENANT } from "@shared/mock-data";
export class TenantEntity extends IndexedEntity<TenantConfig> {
  static readonly entityName = "tenant";
  static readonly indexName = "tenants";
  static readonly initialState: TenantConfig = ST_LOUIS_TENANT;
  static seedData = [ST_LOUIS_TENANT];
}
export class PlaceEntity extends IndexedEntity<Place> {
  static readonly entityName = "place";
  static readonly indexName = "places";
  static readonly initialState: Place = {
    id: "",
    name: "",
    description: "",
    categoryId: "",
    imageUrl: "",
    rating: 0,
    reviewCount: 0,
    address: "",
    district: "",
    tags: []
  };
  static seedData = PLACES;
}
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "", points: 0, badges: [], savedPlaces: [] };
  static seedData = MOCK_USERS;
}