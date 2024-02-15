import { Module } from '@nestjs/common';
import { ServerConfigService } from './server_config.service';
import { ServerConfigController } from './server_config.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ServerConfigController],
  providers: [ServerConfigService],
})
export class ServerConfigModule {}
