import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, albumSchema } from './schema/album.schema';
import { RouteExistsGuard } from './guards/route_exists/route_exists.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Album.name,
        schema: albumSchema,
        collection: Album.name.toLowerCase()
      },
    ])
  ],
  controllers: [AlbumController],
  providers: [AlbumService, RouteExistsGuard, ConfigService],
})
export class AlbumModule {}
