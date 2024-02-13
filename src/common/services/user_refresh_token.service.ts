import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Refresh_Token } from 'src/schemas/refresh_token.schema';

@Injectable()
export class UserRefreshTokenService {
    logger: Logger = new Logger(UserRefreshTokenService.name);
    constructor(
        @InjectModel(Refresh_Token.name) private refreshTokenModel: Model<Refresh_Token>,
    ){

    }
    findOne(userId: string){
        this.logger.log('Finding refresh token.');
        return this.refreshTokenModel.findOne({userId});
    }

    create(userId: string, token: string, expiresAt: Date){
        this.logger.log('Creating refresh token.');
        const newRefreshToken = new this.refreshTokenModel({userId, token, expiresAt});
        return newRefreshToken.save();
    }

    findOneAndUpdate(userId: string, token: string, expiresAt: Date){
        this.logger.log('Updating refresh token.');
        return this.refreshTokenModel.findOneAndUpdate(
            { userId },
            { token, expiresAt },
            { new: true, upsert: true}
        );
    }

    findOneAndRemove(userId: string){
        this.logger.log('Deleting refresh token.');
        return this.refreshTokenModel.findOneAndDelete({userId})
    }
}
