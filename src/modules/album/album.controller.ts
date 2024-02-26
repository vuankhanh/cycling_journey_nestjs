import { Controller, Get, Post, Request, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AlbumService } from './album.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RouteExistsGuard } from './guards/route_exists/route_exists.guard';
import { multerOptions } from 'src/constants/files.constanst';


@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService
  ) { }
  @Get()
  async getAll() {
    return await this.albumService.getAll();
  }

  @Post()
  @UseGuards(RouteExistsGuard)
  @UseInterceptors(FilesInterceptor('many-files', null, multerOptions))
  async create(
    @Request() req,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    console.log(req['customParams']);
    console.log(files);
    return 'ok';
    // return await this.albumService.create();
  }
}
