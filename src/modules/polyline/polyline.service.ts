import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interfaces/basic_service.interface';
import { Polylines } from './schemas/polylines.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PolylineService implements IBasicService<Polylines> {
  constructor(
    @InjectModel(Polylines.name) private polylineModel: Model<Polylines>
  ) {}

  create(data: Polylines) {
    const polyline = new this.polylineModel(data);
    return polyline.save();
  }

  async getAll(page: number, size: number) {
    const countTotal = await this.polylineModel.countDocuments({});
    const milestoneAggregate = await this.polylineModel.aggregate([
      { $skip: size * (page - 1) },
      { $limit: size }
    ]);

    const metaData = {
      data: milestoneAggregate,
      paging: {
        totalItems: countTotal,
        size: size,
        page: page,
        totalPages: Math.ceil(countTotal / size),
      }
    };
    return metaData;
  }

  async getDetail(id: string) {
    const milestone = await this.polylineModel.findById(id);
    return milestone;
  }

  async getLastPolyline() {
    const milestone = await this.polylineModel.findOne().sort({ createdAt: -1 });
    return milestone;
  }

  async replace(id: string | string, data: Polylines) {
    const milestone = await this.polylineModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async modify(id: string, data: Partial<Polylines>) {
    const milestone = await this.polylineModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async remove(id: string) {
    const milestone = await this.polylineModel.findByIdAndDelete(id);
    return milestone
  }
}
