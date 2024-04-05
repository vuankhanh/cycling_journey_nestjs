import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { CACHE_MODULE_OPTIONS, CacheModule } from '@nestjs/cache-manager';
import { StorageHelperService } from './storage_helper.service';
import { StorageAxiosInterceptor } from './interceptors/storage_axios.interceptor';
import { RedisService } from 'src/shared/services/redis.service';
import { RedisProvider } from 'src/providers/cache/redis.provider';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: RedisProvider,
    }),
  ],
  providers: [
    StorageService,
    ConfigService,
    StorageHelperService,
    StorageAxiosInterceptor,
    RedisService
  ],
  exports: [StorageService]
})
export class StorageModule {}
