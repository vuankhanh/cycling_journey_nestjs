import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, albumSchema } from './schema/album.schema';
import { ValidateCreateAlbumGuard } from './guards/validate_create_album.guard';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { Media, mediaSchema } from './schema/media.schema';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Album.name,
        schema: albumSchema,
        collection: Album.name.toLowerCase()
      },
      {
        name: Media.name,
        schema: mediaSchema
      }
    ]),
    StorageModule
  ],
  controllers: [AlbumController],
  providers: [AlbumService, ValidateCreateAlbumGuard, ConfigService, AuthGuard],
})
export class AlbumModule {}
