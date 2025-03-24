import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LongUrl } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  postShortUrl(@Body() longUrl: LongUrl): string {
    return this.appService.postShortUrl(longUrl);
  }
}
