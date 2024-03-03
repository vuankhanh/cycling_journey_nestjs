import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Album } from "src/modules/album/schema/album.schema";
import { ILocation } from "src/shared/interfaces/location.interface";

export type MilestoneDocument = HydratedDocument<Milestone>;

@Schema({})
class Location implements ILocation {
  @Prop({
    type: Number,
    required: true
  })
  lat: number;

  @Prop({
    type: Number,
    required: true
  })
  lng: number;
}

@Schema({
  collection: 'milestone',
  timestamps: true
})
export class Milestone {
  @Prop({
    type: Number,
    unique: [true, 'Numerical order must be unique'],
    required: [true, 'Numerical order is required']
  })
  numericalOrder: number;

  @Prop({
    type: String,
    required: [true, 'Name is required']
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Address is required']
  })
  address: string;

  @Prop({
    type: Date,
    required: [true, 'Datetime is required']
  })
  dateTime: Date;

  @Prop({
    type: Location,
    required: [true, 'Location is required']
  })
  coordinates: ILocation;

  @Prop({
    type: mongoose.Types.ObjectId,
    ref: Album.name,
    default: null
  })
  albumId: mongoose.Types.ObjectId;
  
  constructor(
    numericalOrder: number,
    name: string,
    address: string,
    dateTime: Date,
    coordinates: ILocation,
    albumId: mongoose.Types.ObjectId
  ){
    this.numericalOrder = numericalOrder;
    this.name = name;
    this.address = address;
    this.dateTime = dateTime;
    this.coordinates = coordinates;
    this.albumId = albumId;
  }
}

export const milestoneSchema = SchemaFactory.createForClass(Milestone);