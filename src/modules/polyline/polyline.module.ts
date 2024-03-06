import { Module, forwardRef } from '@nestjs/common';
import { PolylineController } from './polyline.controller';
import { PolylineService } from './polyline.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Polylines, polylineSchema } from './schemas/polylines.schema';
import { GoogleMapsApiService } from 'src/shared/services/google_maps_api.service';
import { MilestoneService } from '../milestone/milestone.service';
import { MilestoneModule } from '../milestone/milestone.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Polylines.name,
        schema: polylineSchema,
        collection: Polylines.name.toLowerCase()
      },
    ]),
    MilestoneModule
  ],
  controllers: [PolylineController],
  providers: [PolylineService, GoogleMapsApiService]
})
export class PolylineModule {}
