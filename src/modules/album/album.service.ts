import { Injectable } from '@nestjs/common';
import { IBasicService } from 'src/shared/interfaces/basic_service.interface';
import { Album } from './schema/album.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import toNoAccentVnHepler from '../../shared/helpers/convert_vietnamese_to_no_accents.helper';
import { IMedia } from 'src/shared/interfaces/media.interface';
import { Media } from './schema/media.schema';

@Injectable()
export class AlbumService implements IBasicService<Album> {
  constructor(
    @InjectModel(Media.name) private mediaModel: Model<Media>,
    @InjectModel(Album.name) private albumModel: Model<Album>
  ) { }

  async checkExistAlbum(name: string) {
    let condition = { route: toNoAccentVnHepler(name) }
    return await this.albumModel.countDocuments(condition);
  }

  async findById(id: mongoose.Types.ObjectId) {
    return await this.albumModel.findById(id);
  }

  async create(data: Album) {
    const album = new this.albumModel(data);
    await album.save();
    return album;
  }

  async getAll() {
    const albums = await this.albumModel.find().lean();
    return albums;
  }

  async getDetail(id: mongoose.Types.ObjectId) {
    const album = await this.albumModel.findById(id);
    return album;
  }

  async replace(id: mongoose.Types.ObjectId, data: Album) {
    const milestone = await this.albumModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async modifyMedias(
    id: mongoose.Types.ObjectId,
    updateQuery: Partial<Album>,
    filesWillRemove: Array<mongoose.Types.ObjectId>,
    newFiles: Array<IMedia>
  ) {
    const arrPromise: Array<Promise<any>> = [];

    const query = { $set: updateQuery };
    
    if (newFiles.length) {
      console.log(newFiles);
      
      const newItems = await this.mediaModel.insertMany(newFiles);
      console.log(newItems);
      
      query['$push'] = {
        media: { $each: newItems }
      }
    }
    
    const updateAlbum = this.albumModel.findByIdAndUpdate(id, query, { safe: true, new: true });
    arrPromise.push(updateAlbum);

    if (filesWillRemove.length) {
      const removeValueQuery = {
        $pull: {
          media: { _id: { $in: filesWillRemove } }
        }
      }
      console.log(removeValueQuery.$pull.media._id);
      const removeItem = this.albumModel.findByIdAndUpdate(id, removeValueQuery, { new: true });
      
      arrPromise.push(removeItem);
    }
    
    await Promise.all(arrPromise);
    const conditional = { _id: new mongoose.Types.ObjectId(id) };
    const album = await this.tranformToDetaiData(conditional);
    return album;
  }

  async modify(id: mongoose.Types.ObjectId, data: Partial<Album>) {
    const milestone = await this.albumModel.findByIdAndUpdate(id, data, { new: true });
    return milestone;
  }

  async remove(id: mongoose.Types.ObjectId) {
    const milestone = await this.albumModel.findByIdAndDelete(id);
    return milestone;
  }

  private async tranformToDetaiData(conditional) {
    return await this.albumModel.aggregate(
      [
        {
          $match: conditional
        }, {
          $addFields: {
            mediaItems: { $sum: { $size: "$media" } }
          }
        }, {
          $replaceWith: {
            $setField: {
              field: "media",
              input: "$$ROOT",
              value: {
                $sortArray: { input: "$media", sortBy: { type: 1 } }
              }
            }
          }
        }, {
          $limit: 1
        }
      ]
    ).then(res => {
      return res[0]
    });
  }
}
