import { Module } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { MilestoneController } from './milestone.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Milestone, milestoneSchema } from './schemas/milestone.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Milestone.name,
        schema: milestoneSchema,
        collection: Milestone.name.toLowerCase()
      },
    ])
  ],
  controllers: [MilestoneController],
  providers: [MilestoneService],
})
export class MilestoneModule {}
