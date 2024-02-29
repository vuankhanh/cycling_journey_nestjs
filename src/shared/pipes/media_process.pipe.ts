import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ImageConverterUtil } from '../utils/image_converter.util';
import { VideoConverterUtil } from '../utils/video_converter.util';

@Injectable()
export class MediaProcessPipe implements PipeTransform {
  constructor() { }
  async transform(files: Express.Multer.File[], metadata: ArgumentMetadata) {
    const newFiles = [];
    for(const file of files) {
      if(file.mimetype.includes('image')){
        const newFile = await ImageConverterUtil.resize(file);
        const thumbnail = await ImageConverterUtil.thumbnail(newFile.path, newFile.destination, newFile.filename);
        
        newFiles.push(newFile);
      }else{
        const newFile = await VideoConverterUtil.convert(file);
        console.log(newFile);
        const thumbnail = await VideoConverterUtil.generateThumbnail(newFile.path, newFile.destination, newFile.filename);
        newFiles.push(newFile);
      }
    }
    return newFiles;
  }

  
}