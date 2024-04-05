import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { RedisService } from 'src/shared/services/redis.service';

@Injectable()
export class StorageHelperService {
  private storageServer: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private redisService: RedisService
  ) {

    const protocol = this.configService.get('storage.protocol');
    const host = this.configService.get('storage.host');
    const port = this.configService.get('storage.port');

    this.storageServer = `${protocol}://${host}:${port}`;
  }

  async login(userName: string, password: string): Promise<{ accessToken: string, refreshToken: string }> {
    const url = `${this.storageServer}/api/auth/login`;
    const data = await this.httpService.axiosRef.post(url, {
      userName,
      password
    }).then(response => {
      const data: IResponse<{ accessToken: string, refreshToken: string }> = response.data;
      return data.metaData;
    })

    await this.redisService.set('storageAccessToken', data.accessToken);
    await this.redisService.set('storageRefreshToken', data.refreshToken);

    return data
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const url = `${this.storageServer}/api/auth/refresh_token`;

    const data = await this.httpService.axiosRef.post(url, {
      refreshToken
    }).then(async response => {
      const data: IResponse<{ accessToken: string }> = response.data;
      return data.metaData;
    })
    await this.redisService.set('storageAccessToken', data.accessToken);

    return data;
  }
}
