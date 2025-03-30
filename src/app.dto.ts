
import { ApiProperty } from '@nestjs/swagger';

export class createShortUrlDto {
  @ApiProperty()
  longUrl: string;
}
