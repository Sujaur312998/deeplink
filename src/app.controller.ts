import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { DeepLink } from './entity/deeplink.entity';
import ShortUniqueId from 'short-unique-id';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('*')
  async getDeepLink(@Req() req: Request, @Res() res: Response) {
    const userAgent = req.headers['user-agent'] || '';
    const response = await this.appService.getLink(userAgent, req.path);
    return res.redirect(response);
  }

  @Post('create-custom-deeplink')
  async createDeepLink(@Body() createDeepLinkDto: DeepLink) {
    const { randomUUID } = new ShortUniqueId({ length: 10 });
    createDeepLinkDto.path='/'+randomUUID();
    return await this.appService.createDeepLink(createDeepLinkDto);
  }
}
