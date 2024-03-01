import { Injectable } from "@nestjs/common";
import * as fse from 'fs-extra';
import * as path from "path";
import { imageTypes, videoTypes } from "src/constants/file.constanst";

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

@Injectable()
export class VideoConverterUtil {
  constructor() { }

  static convert(file: Express.Multer.File): Promise<Express.Multer.File> {
    // start the progress bar with a total value of 200 and start value of 0
    return new Promise((resolve, reject) => {
      const filename = path.parse(file.filename).name;
      const fileOut = file.destination + '/' + filename + '.' + videoTypes.webm.extension;

      const outputWebmOption = ['-f', videoTypes.webm.extension, '-c:v', 'libvpx-vp9', '-b:v', '1M', '-acodec', 'libvorbis'];
      ffmpeg(file.path)
        .output(fileOut)
        .outputOptions(
          outputWebmOption
        ).on('end', function (_) {
          const newFile: Express.Multer.File = {
            ...file,
            filename: filename + '.' + videoTypes.webm.extension,
            mimetype: videoTypes.webm.type,
            path: fileOut,
            size: fse.statSync(fileOut).size
          }

          resolve(newFile);
          fse.unlinkSync(file.path);
        }).on('error', (error) => {
          console.log(error);
          reject(error)
        }).run()
    })
  }

  static generateThumbnail(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const filename = path.parse(file.filename).name;
      const thumbnailName = filename + '-thumbnail' + '.'+ imageTypes.webp.extension;
      const fileOut = file.destination + '/' + thumbnailName;
      
      ffmpeg(file.path)
        .thumbnail({
          timestamps: ['50%'],
          filename: thumbnailName,
          size: '400x225',
          folder: file.destination
        }).on('end', function (_) {
          resolve(fileOut)
        }).on('error', (error) => {
          reject(error)
        });
    })
  }
}