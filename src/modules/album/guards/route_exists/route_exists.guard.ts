import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';
import { AlbumService } from '../../album.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RouteExistsGuard implements CanActivate {
  constructor(
    private readonly albumService: AlbumService,
    private readonly configService: ConfigService
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const name = request.query.name;
    if (!name) {
      return false;
    }

    const isExists = await this.albumService.checkExistAlbum(name);
    if (isExists) {
      throw new ConflictException('Album name already exists');
    };

    const albumFolder = this.configService.get('folder.album');
    request['customParams'] = {};
    request['customParams.albumFolder'] = albumFolder;
    return true;
  }
}
