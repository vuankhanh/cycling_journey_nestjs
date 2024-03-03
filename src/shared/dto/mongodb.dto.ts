import { IsMongoId } from "class-validator";
import mongoose from "mongoose";

export class MongoIdDto {
  @IsMongoId()
  id: mongoose.Types.ObjectId;
}