import { Body, Controller, Get, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlbumService } from './album.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidateCreateAlbumGuard } from './guards/validate_create_album.guard';
import { initializationMulterOptions, modificationMulterOptions } from 'src/constants/file.constanst';
import { AlbumDto } from './dto/album.dto';
import { FilesProccedInterceptor } from 'src/shared/interceptors/files_procced.interceptor';
import { MediaProcessPipe } from 'src/shared/pipes/media_process.pipe';
import { Album } from './schema/album.schema';
import { IMedia } from 'src/shared/interfaces/media.interface';
import toNoAccentVnHepler from 'src/shared/helpers/convert_vietnamese_to_no_accents.helper';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AlbumModifyDto } from './dto/album_modify.dto';
import { MongoIdDto } from 'src/shared/dto/mongodb.dto';
import { ValidateModifyAlbumGuard } from './guards/validate_modify_album.guard';
import { PagingDto } from 'src/shared/dto/paging.dto';
import { ItemsFilterDto } from './dto/items_filter.dto';
import mongoose from 'mongoose';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService
  ) { }

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async getAll(
    @Query(new ValidationPipe({ transform: true })) pagingDto: PagingDto
  ) {
    const page = pagingDto.page || 1;
    const size = pagingDto.size || 10;
    return await this.albumService.getAll(page, size);
  }

  @Get('/detail')
  @UseInterceptors(FormatResponseInterceptor)
  async getDetail(
    @Query(ValidationPipe) itemsFilterDto: ItemsFilterDto
  ) {
    
    //Chỉ cần 1 trong 2 query param là id và route. Nếu có cả 2 thì lấy route
    const query = itemsFilterDto.route ? { route: itemsFilterDto.route } : { _id: new mongoose.Types.ObjectId(itemsFilterDto.id) };
    return await this.albumService.getDetail(query);
  }

  @Post()
  @UseGuards(AuthGuard, ValidateCreateAlbumGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FilesInterceptor('many-files', null, initializationMulterOptions),
    FilesProccedInterceptor,
    FormatResponseInterceptor
  )
  async create(
    @Req() req,
    @Body() body: AlbumDto,
    @UploadedFiles(MediaProcessPipe) medias: Array<IMedia>
  ) {
    const name = req.query.name;
    const relativePath = req['customParams'].relativePath;

    const mainMedia = medias[body.isMain] || medias[0];
    const thumbnail = mainMedia.thumbnailUrl;

    const albumDoc: Album = new Album(
      name,
      body.description,
      toNoAccentVnHepler(name),
      thumbnail,
      medias,
      relativePath
    )
    return await this.albumService.create(albumDoc);
  }

  @Patch(':id')
  @UseGuards(ValidateModifyAlbumGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    FilesInterceptor('many-files', null, modificationMulterOptions),
    FormatResponseInterceptor
  )
  async modify(
    @Param(new ValidationPipe({ whitelist: true })) { id }: MongoIdDto,
    @Body(new ValidationPipe({ transform: true })) body: AlbumModifyDto,
    @UploadedFiles(MediaProcessPipe) medias: Array<IMedia>
  ) {
    const partialAlbumDoc: Partial<Album> = {};

    const name = body.name;
    if (name) {
      partialAlbumDoc.name = name;
      partialAlbumDoc.route = toNoAccentVnHepler(name);
    }

    if (body.description) {
      partialAlbumDoc.description = body.description;
    }

    return await this.albumService.modifyMedias(id, partialAlbumDoc, body.filesWillRemove, medias);
  }

}
