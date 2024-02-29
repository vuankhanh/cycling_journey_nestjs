import { Body, Controller, Get, Post, Request, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlbumService } from './album.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidateCreateAlbumGuard } from './guards/validate_create_album.guard';
import { multerOptions } from 'src/constants/file.constanst';
import { AlbumDto } from './dto/album.dto';
import { FilesProccedInterceptor } from 'src/shared/interceptors/files_procced.interceptor';
import { MediaProcessPipe } from 'src/shared/pipes/media_process.pipe';

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
  @UsePipes(ValidationPipe)
  @UseGuards(ValidateCreateAlbumGuard)
  @UseInterceptors(
    FilesInterceptor('many-files', null, multerOptions),
    FilesProccedInterceptor
  )
  async create(
    @Request() req,
    @Body() body: AlbumDto,
    @UploadedFiles(MediaProcessPipe) files: Express.Multer.File[]
  ) {
    // console.log(body);
    
    // console.log(req['customParams']);
    console.log(files);
    return 'ok';
    // return await this.albumService.create();
  }
}
