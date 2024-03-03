import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

@Injectable()
export class RedisProvider implements CacheOptionsFactory {
  constructor(
    private configService: ConfigService
  ) { }

  createCacheOptions(): CacheModuleOptions {
    return {
      isGlobal: true,
      store: redisStore,
      host: this.configService.get('cache.host'),
      port: this.configService.get('cache.port'),
    }
  }

}