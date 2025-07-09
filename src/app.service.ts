import { BadGatewayException, Injectable } from '@nestjs/common';
import { DeviceDetectorService } from './detector.service';
import { config } from 'lib/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepLink } from './entity/deeplink.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AppService {
  constructor(
    @InjectRepository(DeepLink)
    private readonly deepLinkRepo: Repository<DeepLink>,
    private readonly deviceDetectorService: DeviceDetectorService
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



        //   if (platform === 'default') {
        //     console.log(`Default for platform ${platform}`)
        //     if (typeof targets.default === 'string') {
        //       return targets.default;
        //     }
        //   }

        //   if (typeof target === 'string') {
        //     console.log(`Simple redirect to ${target}`)
        //     return target
        //   }

        //   if (typeof target === 'object' && target.appName) {
        //     let intentURL = `intent://${target.appPath}#Intent;scheme=${target.appName};package=${target.appPackage};action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;category=android.intent.category.BROWSABLE;`;

        //     if (target.fallback) {
        //       intentURL += `S.browser_fallback_url=${encodeURIComponent(
        //         target.fallback
        //       )}`;
        //     }
        //     intentURL += ";end";

        //     return intentURL;

      }
    }

    return '/';
  }
}
