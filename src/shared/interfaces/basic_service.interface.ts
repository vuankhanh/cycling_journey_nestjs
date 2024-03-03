import mongoose, { FlattenMaps, HydratedDocument } from "mongoose";

//T is the DTO, M is the Model
export interface IBasicService<T> {
  create(data: T): Promise<HydratedDocument<T>>;
  getAll(): Promise<FlattenMaps<T>[]>;
  getDetail(id: mongoose.Types.ObjectId): Promise<HydratedDocument<T>>;
  replace(id: mongoose.Types.ObjectId, data: T): Promise<HydratedDocument<T>>;
  modify(id: mongoose.Types.ObjectId, data: Partial<T>): Promise<HydratedDocument<T>>;
  remove(id: mongoose.Types.ObjectId): Promise<HydratedDocument<T>>;
}