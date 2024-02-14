import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Refresh_Token } from 'src/modules/auth/schemas/refresh_token.schema';

@Injectable()
export class RefreshTokenService {
    logger: Logger = new Logger(RefreshTokenService.name);
    constructor(
        @InjectModel(Refresh_Token.name) private refreshTokenModel: Model<Refresh_Token>,
    ){

    }
    findOne(accountId: string, refreshToken: string){
        this.logger.log('Finding refresh token.');
        return this.refreshTokenModel.findOne({ accountId, token: refreshToken });
    }

    create(accountId: string, token: string, expiresAt: Date){
        this.logger.log('Creating refresh token.');
        const newRefreshToken = new this.refreshTokenModel({ accountId, token, expiresAt });
        return newRefreshToken.save();
    }

    findOneAndUpdate(accountId: string, token: string, expiresAt: Date){
        this.logger.log('Updating refresh token.');
        return this.refreshTokenModel.findOneAndUpdate(
            { accountId },
            { token, expiresAt },
            { new: true, upsert: true}
        );
    }

    findOneAndRemove(accountId: string){
        this.logger.log('Deleting refresh token.');
        return this.refreshTokenModel.findOneAndDelete({ accountId })
    }
}
