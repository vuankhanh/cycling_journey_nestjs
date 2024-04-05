import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  client = this.cacheManager.store;;
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager
  ) {
    this.get('facebookUser').then((result) => {
      console.log(result);
      
    })
  }

  get(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, data: any) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    })
  }

  set(key: string, value: any, ttl: number = 0): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, { ttl }, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    })
  }

  del(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    })
  }
}
