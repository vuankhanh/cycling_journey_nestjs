import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ServerConfigService } from './server_config.service';
import { IConfiguration } from 'src/shared/interfaces/config.interface';
import { FormatResponseInterceptor } from 'src/shared/interceptors/format_response.interceptor';

@Controller('config')
export class ServerConfigController {
  constructor(private readonly serverConfigService: ServerConfigService) {}

  @Get()
  @UseInterceptors(FormatResponseInterceptor)
  async getconfig(): Promise<IConfiguration> {
    const accessToken = '835097325034034|QpIS1kwIGS2kEHwpjiTRBvBTFQY';
    const facebookUser = await this.serverConfigService.getUserInfo(accessToken);
    return { facebookUser }
  }
}
