import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ILocation } from "src/shared/interfaces/location.interface";

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
  timestamps: true,
})
export class Polylines {
  @Prop({
    type: Array<[Location] | String>,
    required: true
  })
  polylines: Array<[Location] | String>;
}

export const polylineSchema = SchemaFactory.createForClass(Polylines);