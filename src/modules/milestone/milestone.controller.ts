import { Controller, Get, Param, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { MongoIdDto } from 'src/shared/dto/mongodb.dto';

@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}
  
  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async getAll() {
    return await this.milestoneService.getAll();
  }

  @Get(':id')
  @UseInterceptors(FormatResponseInterceptor)
  async getDetail(@Param(new ValidationPipe({ whitelist: true })) { id }: MongoIdDto) {
    return await this.milestoneService.getDetail(id);
  }
}
