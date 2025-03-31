import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { createShortUrlDto } from './app.dto';
import { Response } from 'express';

@Controller('api/vi')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('url/shorten')
  createShortUrl(@Body() longUrlForm: createShortUrlDto): Promise<string> {
    return this.appService.postShortUrl(longUrlForm);
  }

  @Get(':shorturl')
  async getLongUrl(
    @Param('shorturl') shorturl: string,
    @Res() res: Response,
  ): Promise<any> {
    const longUrl = await this.appService.redirectUrl(shorturl);
    res.redirect(302, longUrl);
  }
}
