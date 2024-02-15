import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class ServerConfigService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  async getUserInfo(accessToken: string) {
    const fbUserId = process.env.FB_USER_ID;
    const url = `http://graph.facebook.com/${fbUserId}?access_token=${accessToken}&fields=name,email,picture.width(200).height(200)`;
    try {
      return await firstValueFrom(
        this.httpService.get(url).pipe(
          map((resp) => resp.data)
        ))
    } catch {
      return
    }
  }
}
