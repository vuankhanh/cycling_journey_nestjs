import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Milestone } from './schemas/milestone.schema';
import mongoose, { Model } from 'mongoose';
import { MilestoneDto } from './dto/milestone.dto';
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

  async getAll() {
    const milestones = await this.milestoneModel.find().sort({ numericalOrder: 1 }).lean();
    return milestones;
  }

  async getDetail(id: mongoose.Types.ObjectId) {
    const milestone = await this.milestoneModel.findById(id).populate('albumId');
    return milestone;
  }

  async replace(id: mongoose.Types.ObjectId, data: Milestone) {
    const milestone = await this.milestoneModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async modify(id: mongoose.Types.ObjectId, data: Partial<Milestone>) {
    const milestone = await this.milestoneModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async remove(id: mongoose.Types.ObjectId) {
    const milestone = await this.milestoneModel.findByIdAndDelete(id);
    return milestone
  }
}
