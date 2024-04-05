import { Readable } from "stream";

export interface IFileType {
  type: string;
  extension: string;
}

export type TProcessedFile = {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export type TPrepareFileForFormdata = {
  file: TProcessedFile;
  thumbnail: TProcessedFile;
}