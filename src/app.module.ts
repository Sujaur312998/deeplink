import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceDetectorService } from './detector';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, DeviceDetectorService],
})
export class AppModule {}
