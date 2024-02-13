import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbService } from './providers/database/mongodb/mongodb.service';
import { RedisService } from './providers/cache/redis/redis.service';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbService,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: RedisService,
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MongodbService,
    RedisService
  ],
})
export class AppModule {
  static port: number;
  constructor(
    @Inject(CACHE_MANAGER) cacheManager,
    private configService: ConfigService
  ) {
    AppModule.port = this.configService.get<number>('app.port');

    const client = cacheManager.store.getClient();
    
    client.on('error', (error: Error)=>{
      console.error('Cache is error');
      // console.info(error);
    })
  }
}
