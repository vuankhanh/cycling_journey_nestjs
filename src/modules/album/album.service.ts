import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interfaces/basic_service.interface';
import { Album } from './schema/album.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AlbumDto } from './dto/album.dto';

import toNoAccentVnHepler from '../../shared/helpers/convert_vietnamese_to_no_accents.helper';

@Injectable()
export class AlbumService implements IBasicService<AlbumDto, Album> {
  constructor(
    @InjectModel(Album.name) private albumModel: Model<Album>
  ) { }

  async checkExistAlbum(name: string) {
    let condition = { route: toNoAccentVnHepler(name) }
    return await this.albumModel.countDocuments(condition);
  }

  async create(data: AlbumDto) {
    const album = new this.albumModel(data);
    await album.save();
    return album;
  }

  async getAll() {
    const albums = await this.albumModel.find().lean();
    return albums;
  }

  async getDetail(id: string) {
    const album = await this.albumModel.findById(id);
    return album;
  }

  async replace(id: string, data: AlbumDto) {
    const milestone = await this.albumModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async modify(id: string, data: Partial<AlbumDto>) {
    const milestone = await this.albumModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async remove(id: string) {
    const milestone = await this.albumModel.findByIdAndDelete(id);
    return milestone
  }

}
