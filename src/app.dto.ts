import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Domains } from '../utils/domains';

export class createShortUrlDto {
  @ApiProperty()
  @IsString()
  longUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  alias: string;

  @ApiProperty()
  @IsString()
  @IsEnum(Domains)
  domain: Domains;
}
