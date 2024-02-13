import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from 'src/schemas/account.schema';
import { UserRefreshTokenService } from 'src/common/services/user_refresh_token.service';
import { SignInDto } from './dto/signin.dto';
import { UserService } from 'src/common/services/user.service';
import { Document } from 'mongoose';
import { AccountDocument } from 'src/interface/Account';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userRefreshToken: UserRefreshTokenService,
        private userService: UserService
    ) { }

    async createToken(account: AccountDocument): Promise<{ token: string, refreshToken: string }> {
        const  { username, role } = account;
        const payload = { username, role };
        
        const token = this.jwtService.sign(payload, {
            secret: process.env.ACCESS_TOKEN_SECRET,
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_TOKEN_SECRET,
            expiresIn: process.env.REFRESH_TOKEN_LIFE
        });

        const refreshTokenLife: number = parseInt(process.env.REFRESH_TOKEN_LIFE);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + refreshTokenLife);

        const accountId: string = account._id.toString();
        await this.userRefreshToken.findOneAndRemove(accountId);
        await this.userRefreshToken.create(accountId, refreshToken, expiresAt);

        return { token, refreshToken };
    }

    validateUser(username: string, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(true)
        })
    }

}
