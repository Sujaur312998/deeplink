import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

export class AndroidAppDetailsDto {
  @IsString()
  appName: string;

  @IsString()
  appPackage: string;

  @IsString()
  appPath: string;

  @IsString()
  fallback: string;
}

export class IOSAppDetailsDto {
  @IsString()
  appName: string;

  @IsString()
  appPath: string;

  @IsString()
  fallback: string;
}

export class DefaultDetailsDto {
  @IsString()
  fallback: string;
}

export class TergetsDto {
  @IsObject()
  @Type(() => AndroidAppDetailsDto)
  android: AndroidAppDetailsDto;

  @IsObject()
  @Type(() => IOSAppDetailsDto)
  ios: IOSAppDetailsDto;

  @IsObject()
  @Type(() => DefaultDetailsDto)
  default: DefaultDetailsDto;
}

export class CreateDeepLinkDto {
  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @ValidateNested()
  @Type(() => TergetsDto)
  tergets: TergetsDto;
}
