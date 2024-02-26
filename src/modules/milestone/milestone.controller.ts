import { Body, Controller, Get, Param, Patch, Post, Put, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { MongoIdDto } from 'src/shared/dto/mongodb.dto';
import { MilestoneDto } from './dto/milestone.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { MongoExceptionFilter } from 'src/shared/filters/mongo_exception.filter';

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

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @UseInterceptors(FormatResponseInterceptor)
  async create(@Body() milestoneDto: MilestoneDto) {
    return await this.milestoneService.create(milestoneDto);
  }

  @Put()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @UseInterceptors(FormatResponseInterceptor)
  async replace(@Param(new ValidationPipe({ whitelist: true })) { id }: MongoIdDto, @Body() milestoneDto: MilestoneDto) {
    return await this.milestoneService.replace(id, milestoneDto);
  }

  @Patch(':id')
  @UseFilters(MongoExceptionFilter)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @UseInterceptors(FormatResponseInterceptor)
  async modify(@Param(new ValidationPipe({ whitelist: true })) { id }: MongoIdDto, @Body() milestoneDtoPartial: Partial<MilestoneDto>) {
    return await this.milestoneService.modify(id, milestoneDtoPartial);
  }

}
