import { Injectable } from '@nestjs/common';
import { LongUrl } from './app.dto';

@Injectable()
export class AppService {
  postShortUrl (longUrl: LongUrl){
    return '';
  }
}
