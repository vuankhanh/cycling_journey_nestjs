import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Milestone } from './schemas/milestone.schema';
import { Model } from 'mongoose';
import { MilestoneDto } from './dto/milestone.dto';

@Injectable()
export class MilestoneService {
    constructor(
        @InjectModel(Milestone.name) private milestoneModel: Model<Milestone>
    ){ }

    async create(milestoneDto: MilestoneDto){
        const milestone = new this.milestoneModel(milestoneDto);
        await milestone.save();
        return milestone;
    }

    async getAll(){
        const milestones = await this.milestoneModel.find().sort({numericalOrder: 1}).lean();
        return milestones;
    }

    async getDetail(id: string){
        const milestone = await this.milestoneModel.findById(id).populate('albumId');
        return milestone;
    }

    async replace(id: string, data){
        const milestone = await this.milestoneModel.findByIdAndUpdate(id, data, { new: true });
        return milestone;
    }

    async modify(id: string, data){
        const milestone = await this.milestoneModel.findByIdAndUpdate(id, data, { new: true });
        return milestone;
    }

    async remove(id: string){
        const milestone = await this.milestoneModel.findByIdAndDelete(id);
        return milestone
    }
}
