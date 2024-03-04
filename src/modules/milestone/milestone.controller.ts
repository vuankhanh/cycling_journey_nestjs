import { Body, Controller, Get, Param, Patch, Post, Put, Query, Req, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { MilestoneService } from './milestone.service';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { MongoIdDto } from 'src/shared/dto/mongodb.dto';
import { MilestoneDto } from './dto/milestone.dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { MongoExceptionFilter } from 'src/shared/filters/mongo_exception.filter';
import { Milestone } from './schemas/milestone.schema';
import { PagingDto } from 'src/shared/dto/paging.dto';

@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) { }

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async getAll(
    @Query(new ValidationPipe({ transform: true })) pagingDto: PagingDto
  ) {
    const page = pagingDto.page || 1;
    const size = pagingDto.size || 10;
    return await this.milestoneService.getAll(page, size);
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
    const milestone: Milestone = new Milestone(
      milestoneDto.numericalOrder,
      milestoneDto.name,
      milestoneDto.address,
      milestoneDto.dateTime,
      milestoneDto.coordinates,
      milestoneDto.albumId
    );
    return await this.milestoneService.create(milestone);
  }

  @Put()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @UseInterceptors(FormatResponseInterceptor)
  async replace(@Param(new ValidationPipe({ whitelist: true })) { id }: MongoIdDto, @Body() milestoneDto: MilestoneDto) {
    const milestone: Milestone = new Milestone(
      milestoneDto.numericalOrder,
      milestoneDto.name,
      milestoneDto.address,
      milestoneDto.dateTime,
      milestoneDto.coordinates,
      milestoneDto.albumId
    );
    return await this.milestoneService.replace(id, milestone);
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
