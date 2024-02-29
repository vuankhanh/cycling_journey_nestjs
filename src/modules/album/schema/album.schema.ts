import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { IMedia } from "src/shared/interfaces/media.interface";

export type AlbumDocument = HydratedDocument<Album>;

@Schema({
  collection: 'album',
  timestamps: true
})
export class Album {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: String,
    required: true,
    unique: true
  })
  route: string;

  @Prop({
    type: String,
    required: true
  })
  thumbnail: string;

  @Prop({
    type: Array<IMedia>
  })
  media: Array<IMedia>;

  @Prop({
    type: String,
    required: true
  })
  relativePath: string;
}

export const albumSchema = SchemaFactory.createForClass(Album);