import { FlattenMaps, HydratedDocument } from "mongoose";

//T is the DTO, M is the Model
export interface IBasicService<T, M> {
    create(data: T): Promise<HydratedDocument<M>>;
    getAll(): Promise<FlattenMaps<M>[]>;
    getDetail(id: string): Promise<HydratedDocument<M>>;
    replace(id: string, data: T): Promise<HydratedDocument<M>>;
    modify(id: string, data: Partial<T>): Promise<HydratedDocument<M>>;
    remove(id: string): Promise<HydratedDocument<M>>;
}