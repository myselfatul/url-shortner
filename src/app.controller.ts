import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { createShortUrlDto } from './app.dto';

@Controller('api/vi')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('url/shorten')
  createShortUrl(@Body() longUrlForm: createShortUrlDto): Promise<string> {
    return this.appService.postShortUrl(longUrlForm);
  }
}
