import { Injectable, InternalServerErrorException, PipeTransform } from '@nestjs/common';
import { ImageConverterUtil } from '../utils/image_converter.util';
import { VideoConverterUtil } from '../utils/video_converter.util';
import * as path from 'path';
import { imageTypes, videoTypes } from 'src/constants/file.constanst';
import { TPrepareFileForFormdata, TProcessedFile } from '../interfaces/files.interface';

@Injectable()
export class FileProcessPipe implements PipeTransform {
  async transform(files: Express.Multer.File[]) {
    try {
      const processedFiles: Array<TPrepareFileForFormdata> = await Promise.all(
        files.map(async file=>{
          return file.mimetype.includes('image') ? await this.processImage(file) : await this.processVideo(file);
        })
      )
      return processedFiles;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async processImage(file: Express.Multer.File): Promise<TPrepareFileForFormdata> {
    const bufferFile = await ImageConverterUtil.resize(file);
    const newFile = {
      originalname: [path.parse(file.originalname).name, imageTypes.webp.extension].join('.'),
      buffer: bufferFile,
      mimetype: imageTypes.webp.type
    };

    const newThumbnailFile = {
      originalname: [path.parse(file.originalname).name+'-thumbnail', imageTypes.webp.extension].join('.'),
      buffer: await ImageConverterUtil.thumbnail(bufferFile),
      mimetype: imageTypes.webp.type
    };

    const prepareFileForFormdata: TPrepareFileForFormdata = {
      file: newFile,
      thumbnail: newThumbnailFile
    }
    return prepareFileForFormdata
  }

  private async processVideo(file: Express.Multer.File): Promise<TPrepareFileForFormdata> {
    const bufferFile = await VideoConverterUtil.convert(file);
    const newFile = {
      originalname: [path.parse(file.originalname).name, videoTypes.webm.extension].join('.'),
      buffer: bufferFile,
      mimetype: videoTypes.webm.type
    };
    
    const newThumbnailFile = {
      originalname: [path.parse(file.originalname).name+'-thumbnail', imageTypes.webp.extension].join('.'),
      buffer: await VideoConverterUtil.generateThumbnail(bufferFile),
      mimetype: imageTypes.webp.type
    };

    const prepareFileForFormdata: TPrepareFileForFormdata = {
      file: newFile,
      thumbnail: newThumbnailFile
    }
    return prepareFileForFormdata
  }
}