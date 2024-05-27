import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache, Store } from 'cache-manager';

@Injectable()
export class RedisService {
  client: Store;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    this.client = cacheManager.store;
  }

  get(key: string): Promise<any> {
    return this.client.get(key);
  }

  set(key: string, value: any, ttl: number = 0) {
    return this.client.set(key, value, ttl)
  }

  del(key: string) {
    return this.client.del(key);
  }
}
