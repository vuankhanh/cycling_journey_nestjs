import { Body, Controller, Get, Post, Request, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlbumService } from './album.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidateCreateAlbumGuard } from './guards/validate_create_album.guard';
import { multerOptions } from 'src/constants/file.constanst';
import { AlbumDto } from './dto/album.dto';
import { FilesProccedInterceptor } from 'src/shared/interceptors/files_procced.interceptor';
import { MediaProcessPipe } from 'src/shared/pipes/media_process.pipe';
import { Album } from './schema/album.schema';
import { IMedia } from 'src/shared/interfaces/media.interface';
import toNoAccentVnHepler from 'src/shared/helpers/convert_vietnamese_to_no_accents.helper';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';

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
    FilesProccedInterceptor,
    FormatResponseInterceptor
  )
  async create(
    @Request() req,
    @Body() body: AlbumDto,
    @UploadedFiles(MediaProcessPipe) medias: Array<IMedia>
  ) {
    const name = req.query.name;
    const relativePath = req['customParams'].relativePath;

    const mainMedia = medias[body.isMain] || medias[0];
    const thumbnail = mainMedia.thumbnailUrl; 
    const albumDoc: Album = {
      name,
      description: body.description,

      route: toNoAccentVnHepler(name),
      thumbnail,

      media: medias,
      relativePath
    }

    return await this.albumService.create(albumDoc);
  }
}
