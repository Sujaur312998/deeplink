import { Injectable } from '@nestjs/common';
import { DeviceDetectorService } from './detector';
import { config } from 'lib/config';
@Injectable()
export class AppService {
  constructor(
    private readonly deviceDetectorService: DeviceDetectorService
  ) { }
  getHello(
    userAgent: string,
    reqPath: string,
  ): string {
    if (config.length === 0) {
      throw new Error('CONFIG environment variable must be set')
    }
    const targets = config.find(({ path }) => path === reqPath)?.targets;

    if (!targets) {
      console.log(`No targets for path ${reqPath}`)
      return '/'
    }

    const platforms = this.deviceDetectorService.detectPlatform(userAgent);


    for (const platform of platforms) {
      const target = targets[platform];
      if (!target) {
        console.log(`No redirect for platform ${platform}`)
        continue
      }

      if (platform === 'default') {
        console.log(`Default for platform ${platform}`)
        if (typeof targets.default === 'string') {
          return targets.default;
        }
      }

      if (typeof target === 'string') {
        console.log(`Simple redirect to ${target}`)
        return target
      }

      if (typeof target === 'object' && target.appName) {
        let intentURL = `intent://${target.appPath}#Intent;scheme=${target.appName};package=${target.appPackage};action=android.intent.action.VIEW;category=android.intent.category.DEFAULT;category=android.intent.category.BROWSABLE;`;

        if (target.fallback) {
          intentURL += `S.browser_fallback_url=${encodeURIComponent(
            target.fallback
          )}`;
        }
        intentURL += ";end";

        return intentURL;

      }
    }

    return '/';
  }
}
