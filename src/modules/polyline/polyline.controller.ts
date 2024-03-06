import { Controller, Get, Inject, Post, UseInterceptors } from '@nestjs/common';
import { PolylineService } from './polyline.service';
import { GoogleMapsApiService } from 'src/shared/services/google_maps_api.service';
import { MilestoneService } from '../milestone/milestone.service';
import { DirectionPointHelper } from 'src/shared/helpers/direction_point.helper';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';

@Controller('polyline')
export class PolylineController {
  constructor(
    private readonly milestoneService: MilestoneService,
    private readonly polylineService: PolylineService,
    private readonly googleMapsApiService: GoogleMapsApiService
  ) {}

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  getLastPolyline() {
    return this.polylineService.getLastPolyline();
  }

  @Post()
  async updatePolyline() {
    const milestones = await this.milestoneService.getAllWithoutPaging();
    const arrSelectives = DirectionPointHelper.coordinatesInOrderSelective(milestones);
    return this.googleMapsApiService.getDirections(arrSelectives)
  }
}
