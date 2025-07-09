export type TargetValue =
  | string
  | {
      appName: string;
      appPackage?: string;
      appPath: string;
      fallback: string;
    };

// Full targets for one path
export interface DeepLinkTargets {
  android?: TargetValue;
  ios?: TargetValue;
  desktop?: TargetValue;
  default: string | TargetValue;
  [key: string]: TargetValue | undefined;
}

// One route config
export interface DeepLinkConfig {
  path: string;
  targets: DeepLinkTargets;
}

export const config : DeepLinkConfig[] =
  [
    {
      "path": '/test',
      "targets": {
        "android": 'https://play.google.com/store/apps/details?id=com.twitter.android',
        "ios": '"https://apps.apple.com/us/app/twitter/id333903271',
        "desktop": "https://suja.vercel.app/",
        "default": 'https://suja.vercel.app/',
      },
    },
    {
      "path": "/deeplink",
      "targets": {
        "android": {
          "appName": "twitter",
          "appPackage": "com.twitter.android",
          "appPath": "user?screen_name=appwrite",
          "fallback": "https://play.google.com/store/apps/details?id=com.twitter.android"
        },
        "ios": {
          "appName": "twitter",
          "appPath": "user?screen_name=appwrite",
          "fallback": "https://apps.apple.com/us/app/twitter/id333903271"
        },
        "default": "https://twitter.com/appwrite"
      }
    }
  ];