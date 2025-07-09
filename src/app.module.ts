import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DeviceDetectorService } from './detector.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/db.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeepLink } from './entity/deeplink.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.development.local',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    TypeOrmModule.forFeature([DeepLink])
  ],
  controllers: [AppController],
  providers: [AppService, DeviceDetectorService],
})
export class AppModule {}
