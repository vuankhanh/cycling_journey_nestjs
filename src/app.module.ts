import { Inject, Logger, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ServerConfigModule } from './modules/server_config/server_config.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { MongodbProvider } from './providers/database/mongodb.provider';
import { RedisProvider } from './providers/cache/redis.provider';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { MilestoneModule } from './modules/milestone/milestone.module';
import { AlbumModule } from './modules/album/album.module';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigProvider } from './providers/common/multer.provider';
import { PolylineModule } from './modules/polyline/polyline.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongodbProvider,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useClass: RedisProvider,
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: MulterConfigProvider,
    }),
    AuthModule,
    ServerConfigModule,
    MilestoneModule,
    AlbumModule,
    PolylineModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  logger: Logger = new Logger(AppModule.name);
  static port: number;
  constructor(
    @Inject(CACHE_MANAGER) cacheManager,
    private configService: ConfigService
  ) {
    AppModule.port = this.configService.get<number>('app.port');

    const client = cacheManager.store.getClient();

    client.on('error', (error: Error) => {
      this.logger.error(error.message);
    })
  }
}
