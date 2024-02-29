import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, albumSchema } from './schema/album.schema';
import { ValidateCreateAlbumGuard } from './guards/validate_create_album.guard';
import { ConfigService } from '@nestjs/config';
import { ImageConverterUtil } from 'src/shared/utils/image_converter.util';

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
  providers: [AlbumService, ValidateCreateAlbumGuard, ConfigService],
})
export class AlbumModule {}
