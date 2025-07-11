import { BadGatewayException, Injectable } from '@nestjs/common';
import { DeviceDetectorService } from './detector.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepLink } from './entity/deeplink.entity';
import { DataSource, Repository } from 'typeorm';
import { AndroidAppDetails } from './entity/androidaAppdetails.entity';
import { IOSAppDetails } from './entity/iosAppdetails.entity';
import { DefaultDetails } from './entity/default.entity';
import { Tergets } from './entity/tergets.entity';
import { DeepLinkPaginationDto } from './dto/paginationDto';
import { CreateDeepLinkDto } from './dto/create-deeplink.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(DeepLink)
    private readonly deepLinkRepo: Repository<DeepLink>,
    @InjectRepository(AndroidAppDetails)
    private readonly androidAppDetailsRepo: Repository<AndroidAppDetails>,
    @InjectRepository(IOSAppDetails)
    private readonly iosAppDetailsRepo: Repository<IOSAppDetails>,
    @InjectRepository(DefaultDetails)
    private readonly defaultDetailsRepo: Repository<DefaultDetails>,
    @InjectRepository(Tergets)
    private readonly tergetRepo: Repository<Tergets>,
    private readonly deviceDetectorService: DeviceDetectorService,
    private readonly dataSource: DataSource
  ) { }

  async getLink(
    userAgent: string,
    reqPath: string,
  ) {

    const deeplink: DeepLink | null = await this.deepLinkRepo.findOne({ where: { path: reqPath } })

    if (!deeplink) {
      throw new BadGatewayException('CONFIG environment variable must be string')
    }

    const platforms = this.deviceDetectorService.detectPlatform(userAgent);


    for (const platform of platforms) {
      switch (platform) {
        case 'android': {
          const { appName, appPackage, appPath, fallback } = deeplink.tergets.android
          let intentURL = `intent://${appPath}#Intent;scheme=${appName};package=${appPackage};action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;category=android.intent.category.BROWSABLE;`;

          if (fallback) {
            intentURL += `S.browser_fallback_url=${encodeURIComponent(
              fallback
            )}`;
          }
          intentURL += ";end";
          return intentURL;
        }
        case 'ios': {
          const { appName, appPath, fallback } = deeplink.tergets.ios
          const deepLink = `${appName}://${appPath}`;
          // return { deepLink, fallback };
          return deepLink;
        }
        case 'desktop':
          return deeplink.tergets.default.fallback;

        default:
          return deeplink.tergets.default.fallback;
      }
    }

    return '/';
  }

  async createDeepLink(createDeepLinkDto: CreateDeepLinkDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { android, ios, default: defaultTarget } = createDeepLinkDto.tergets;

      const androidRes = await queryRunner.manager.save(this.androidAppDetailsRepo.target, android);
      const iosRes = await queryRunner.manager.save(this.iosAppDetailsRepo.target, ios);
      const defaultRes = await queryRunner.manager.save(this.defaultDetailsRepo.target, defaultTarget);

      const tergetRes = await queryRunner.manager.save(this.tergetRepo.target, {
        android: androidRes,
        ios: iosRes,
        default: defaultRes,
      });

      const deepLinkRes = await queryRunner.manager.save(this.deepLinkRepo.target, {
        path: createDeepLinkDto.path,
        tergets: tergetRes,
      });
      await queryRunner.commitTransaction();
      return deepLinkRes;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadGatewayException(error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findAllDeepLinks(deepLinkPaginationDto: DeepLinkPaginationDto) {
    const { page, limit } = deepLinkPaginationDto
    const [data, total] = await this.deepLinkRepo.findAndCount({
      relations: {
        tergets: {
          android: true,
          ios: true,
          default: true,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {
        id: 'DESC',
      },
    });

    return {
      data,
      total,
      page,
      pageCount: Math.ceil(total / limit),
    };
  }

}
