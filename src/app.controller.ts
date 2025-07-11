import { Body, Controller, Get, Query, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import ShortUniqueId from 'short-unique-id';
import { DeepLinkPaginationDto } from './dto/paginationDto';
import { CreateDeepLinkDto } from './dto/create-deeplink.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('getdeeplinks')
  async getDeepLinkwithPagination(@Query() deepLinkPaginationDto: DeepLinkPaginationDto) {
    return await this.appService.findAllDeepLinks(deepLinkPaginationDto);
  }

  @Get('*')
  async getDeepLink(@Req() req: Request, @Res() res: Response) {
    const userAgent = req.headers['user-agent'] || '';
    const response = await this.appService.getLink(userAgent, req.path);
    return res.redirect(response);
  }

  @Post('create-custom-deeplink')
  async createDeepLink(@Body() createDeepLinkDto: CreateDeepLinkDto) {
    const { randomUUID } = new ShortUniqueId({ length: 10 });
    createDeepLinkDto.path = '/' + randomUUID();
    return await this.appService.createDeepLink(createDeepLinkDto);
  }
}
