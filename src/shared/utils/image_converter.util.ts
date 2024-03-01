import { Injectable } from "@nestjs/common";

import * as sharp from 'sharp';
import * as fse from 'fs-extra';
import * as path from 'path';
import { illustration, imageTypes } from "src/constants/file.constanst";

@Injectable()
export class ImageConverterUtil {
  constructor() { }

  static async resize(file: Express.Multer.File): Promise<Express.Multer.File> {
    const filename = path.parse(file.filename).name;
    const fileOut = file.destination + '/' + filename + '.' + imageTypes.webp.extension;
    const outputInfo = await sharp(file.path)
      .rotate()
      .resize(illustration.width, illustration.height)
      .webp()
      .toFile(fileOut);

    fse.removeSync(file.path);

    const newFile: Express.Multer.File = {
      ...file,
      filename: filename + '.' + imageTypes.webp.extension,
      mimetype: imageTypes.webp.type,
      path: fileOut,
      size: outputInfo.size
    }
    return newFile;
  }

  static async thumbnail(file: Express.Multer.File): Promise<string> {
    const filename = path.parse(file.filename).name;
    const fileOut = file.destination + '/' + filename + '-thumbnail' + '.' + imageTypes.webp.extension;
    await sharp(file.path).resize({ width: 400 }).withMetadata().toFile(fileOut);
    return fileOut;
  }
}