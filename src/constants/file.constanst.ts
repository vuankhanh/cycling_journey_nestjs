import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import * as multer from 'multer';
import * as fse from 'fs-extra';

import toNoAccentVnHepler from '../shared/helpers/convert_vietnamese_to_no_accents.helper';
import { BadRequestException } from "@nestjs/common";
import { IFileType } from "src/shared/interfaces/files.interface";

export const multerOptions: MulterOptions = {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const name: string = req.query.name as string;
      const albumFolder = 'cycling-journey-album';
      const destination = req['customParams'].albumFolder;
      const relativePath = albumFolder + '/' + toNoAccentVnHepler(name);
      const absolutePath = destination + '/' + relativePath;
      req['customParams'].relativePath = relativePath;
      fse.ensureDirSync(absolutePath);
      cb(null, absolutePath);
    },
    filename: (req, file, cb) => {
      const name: string = req.query.name as string;
      const filename = `${Date.now()}-${toNoAccentVnHepler(name)}-${file.originalname}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    const match = ['image/png', 'image/jpeg', 'video/mp4', 'video/quicktime', 'video/webm'];
    if (match.indexOf(file.mimetype) === -1) {
      return cb(new BadRequestException('Invalid file type'), false);
    }
    return cb(null, true);
  }
}

const imageEnums = ['webp', 'jpeg', 'png'] as const;
const videoEnums = ['mp4', 'quicktime', 'webm'] as const;

export const imageTypes: { [key in typeof imageEnums[number]]: IFileType } = {
  webp: {
    type: 'image/webp',
    extension: 'webp'
  },
  jpeg: {
    type: 'image/jpeg',
    extension: 'jpeg'
  },
  png: {
    type: 'image/png',
    extension: 'png'
  },
};

export const videoTypes: { [key in typeof videoEnums[number]]: IFileType } = {
  mp4: {
    type: 'video/mp4',
    extension: 'mp4'
  },
  quicktime: {
    type: 'video/quicktime',
    extension: 'mov'
  },
  webm: {
    type: 'video/webm',
    extension: 'webm'
  }
};

export const illustration = {
  width: 1280,
  height: 720
}