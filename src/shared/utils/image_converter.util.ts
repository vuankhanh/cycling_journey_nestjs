import { Injectable } from "@nestjs/common";

import * as sharp from 'sharp';
import { illustration } from "src/constants/file.constanst";

@Injectable()
export class ImageConverterUtil {
  constructor() { }

  static async resize(file: Express.Multer.File): Promise<Buffer> {
    return await sharp(file.buffer)
    .rotate()
    .resize(illustration.width, illustration.height)
    .webp()
    .toBuffer();
  }

  static async thumbnail(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer).resize({ width: 400 }).withMetadata().toBuffer();
  }
}