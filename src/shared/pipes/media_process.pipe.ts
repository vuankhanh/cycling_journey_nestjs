import { Injectable, InternalServerErrorException, PipeTransform } from '@nestjs/common';
import { ImageConverterUtil } from '../utils/image_converter.util';
import { VideoConverterUtil } from '../utils/video_converter.util';
import { IMedia } from '../interfaces/media.interface';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class MediaProcessPipe implements PipeTransform {
  constructor(
    private configService: ConfigService
  ) { }
  async transform(files: Express.Multer.File[]) {
    const albumFolder = this.configService.get('folder.album');
    try {
      const medias: Array<IMedia> = [];
      for (const file of files) {
        let newFile: Express.Multer.File;
        let thumbnail: string;
        let type: 'image' | 'video';

        if (file.mimetype.includes('image')) {
          newFile = await ImageConverterUtil.resize(file);
          thumbnail = await ImageConverterUtil.thumbnail(newFile);
          type = 'image';
        } else {
          newFile = await VideoConverterUtil.convert(file);
          thumbnail = await VideoConverterUtil.generateThumbnail(newFile);
          type = 'video';
        }

        const media: IMedia = {
          url: path.relative(albumFolder, newFile.path),
          thumbnailUrl: path.relative(albumFolder, thumbnail),
          name: newFile.originalname,
          description: '',
          caption: '',
          alternateName: '',
          type
        }
        medias.push(media);
      }
      return medias;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}