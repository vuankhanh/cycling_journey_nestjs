import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Account, accountSchema } from '../../schemas/account.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { Refresh_Token, refreshTokenSchema } from 'src/schemas/refresh_token.schema';
import { UserRefreshTokenService } from 'src/common/services/user_refresh_token.service';
import { UserService } from 'src/common/services/user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ global: true }),
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: accountSchema,
        collection: Account.name.toLowerCase()
      },
      {
        name: Refresh_Token.name,
        schema: refreshTokenSchema,
        collection: Refresh_Token.name.toLowerCase()
      }
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UserService, UserRefreshTokenService]
})
export class AuthModule { }
