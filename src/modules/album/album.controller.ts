import { Body, Controller, Get, InternalServerErrorException, Param, Patch, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlbumService } from './album.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ValidateCreateAlbumGuard } from './guards/validate_create_album.guard';
import { initializationMulterOptions, modificationMulterOptions } from 'src/constants/file.constanst';
import { AlbumDto } from './dto/album.dto';
import { FilesProccedInterceptor } from 'src/shared/interceptors/files_procced.interceptor';
import { FileProcessPipe } from 'src/shared/pipes/file_process.pipe';
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
import { Request } from 'express';
import { TPrepareFileForFormdata } from 'src/shared/interfaces/files.interface';
import * as fse from 'fs-extra';
import { StorageService } from '../storage/storage.service';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly storageService: StorageService
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
    @Req() req: Request,
    @Body() body: AlbumDto,
    @UploadedFiles(FileProcessPipe) medias: Array<IMedia>
  ) {
    const name = <string>req.query.name;
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

  @Post('/ensure_path')
  ensurePath(
    @Query('path') path: string,
  ){
    return this.storageService.ensurePath(path);
  }

  @Post('/test')
  // @UseGuards(AuthGuard, ValidateCreateAlbumGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(
    // FilesInterceptor('many-files'),
    // FilesProccedInterceptor,
  )
  async testingCreate(
    @Req() req: Request,
    @Query('name') name: string,
    @Body() body: AlbumDto,
    // @UploadedFiles(FileProcessPipe) processedFiles:  Array<TPrepareFileForFormdata>
  ) {
    
    const albumFolder = 'cycling-journey-album';
    const relativePath = albumFolder + '/' + toNoAccentVnHepler(name); 

    const processedFiles:  Array<TPrepareFileForFormdata> = [
      {
        file: {
          originalname: '20240228_112342.webp',
          buffer: fse.readFileSync('./uploads/20240228_112342.webp'),
          mimetype: 'image/webp'
        },
        thumbnail: {
          originalname: '20240228_112342-thumbnail.webp',
          buffer: fse.readFileSync('./uploads/20240228_112342-thumbnail.webp'),
          mimetype: 'image/webp'
        }
      },
      {
        file: {
          originalname: 'pull-up (online-video-cutter.com)_2.webm',
          buffer: fse.readFileSync('./uploads/pull-up (online-video-cutter.com)_2.webm'),
          mimetype: 'image/webm'
        },
        thumbnail: {
          originalname: 'pull-up (online-video-cutter.com)_2-thumbnail.webp',
          buffer: fse.readFileSync('./uploads/pull-up (online-video-cutter.com)_2-thumbnail.webp'),
          mimetype: 'image/webp'
        }
      }
    ]

    return this.storageService.forwardFile(relativePath, processedFiles);
    
    // for(let processedFile of processedFiles){
    //   console.log(processedFile);
    //   fse.writeFileSync(`./uploads/${processedFile.file.originalname}`, processedFile.file.buffer);
    //   fse.writeFileSync(`./uploads/${processedFile.thumbnail.originalname}`, processedFile.thumbnail.buffer);
    // }

    // const relativePath = req['customParams'].relativePath;

    // const mainMedia = medias[body.isMain] || medias[0];
    // const thumbnail = mainMedia.thumbnailUrl;

    // const albumDoc: Album = new Album(
    //   name,
    //   body.description,
    //   toNoAccentVnHepler(name),
    //   thumbnail,
    //   medias,
    //   relativePath
    // )
    // return await this.albumService.create(albumDoc);

    return;
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
    @UploadedFiles(FileProcessPipe) medias: Array<IMedia>
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
