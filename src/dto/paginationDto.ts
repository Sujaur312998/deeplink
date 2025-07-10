import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class DeepLinkPaginationDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page: number = 1;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @Min(1)
  limit: number = 10;
}
