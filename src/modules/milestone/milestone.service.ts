import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Milestone } from './schemas/milestone.schema';
import mongoose, { Model } from 'mongoose';
import { IBasicService } from 'src/shared/interfaces/basic_service.interface';

@Injectable()
export class MilestoneService implements IBasicService<Milestone> {
  constructor(
    @InjectModel(Milestone.name) private milestoneModel: Model<Milestone>
  ) { }

  async create(milestoneDto: Milestone) {
    if (!milestoneDto.numericalOrder) {
      const pipeline: any[] = [
        { $sort: { numericalOrder: 1 } },
        { $group: { _id: null, numericalOrders: { $push: "$numericalOrder" } } },
        { $addFields: { allNumbers: { $range: [1, { $add: [{ $size: "$numericalOrders" }, 2] }] } } },
        { $addFields: { missingNumericalOrder: { $arrayElemAt: [{ $setDifference: ["$allNumbers", "$numericalOrders"] }, 0] } } }
      ];

      const result = await this.milestoneModel.aggregate(pipeline);
      const missingNumericalOrder = result[0]?.missingNumericalOrder;
      milestoneDto.numericalOrder = missingNumericalOrder;
    }
    const milestone = new this.milestoneModel(milestoneDto);
    await milestone.save();
    return milestone;
  }

  async getAll(page: number, size: number) {
    const countTotal = await this.milestoneModel.countDocuments({});
    const milestoneAggregate = await this.milestoneModel.aggregate([
      { $sort: { numericalOrder: 1 } },
      { $skip: size * (page - 1) },
      { $limit: size }
    ])
    // const milestones = await this.milestoneModel.find().sort({ numericalOrder: 1 }).lean();
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
    const milestone = await this.milestoneModel.findById(id).populate('albumId');
    return milestone;
  }

  async replace(id: string | string, data: Milestone) {
    const milestone = await this.milestoneModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async modify(id: string, data: Partial<Milestone>) {
    const milestone = await this.milestoneModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async remove(id: string) {
    const milestone = await this.milestoneModel.findByIdAndDelete(id);
    return milestone
  }
}
