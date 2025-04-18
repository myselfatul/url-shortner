import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { encodeBase62 } from '../utils/base64EncodingDecoding';
import { createUniqueId } from '../utils/uniqueIdGenerator';
import { PrismaService } from './prisma.service';
import { Prisma, UrlMapping } from '@prisma/client';
import { createShortUrlDto } from './app.dto';

@Injectable()
export class AppService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async postShortUrl(longUrlForm: createShortUrlDto) {
    const getExistingShortUrl = await this.getShortUrl(longUrlForm);
    if (getExistingShortUrl) {
      return getExistingShortUrl.shortUrl;
    }
    if (longUrlForm.alias) {
      const alias = await this.getAlias(longUrlForm.alias);
      if (alias) {
        throw new Error('Alias is not available!');
      }
      await this.create({
        longUrl: longUrlForm.longUrl,
        shortUrl: `${longUrlForm.domain}/${longUrlForm.alias}`,
        alias: longUrlForm.alias,
      });
      return `${longUrlForm.domain}/${longUrlForm.alias}`;
    }
    const machineId = this.configService.get<number>('MACHINE_ID') || 1;
    const dataCentreId = this.configService.get<number>('DATA_CENTRE_ID') || 1;
    const generateId = createUniqueId(machineId, dataCentreId);
    const shortUrlString = encodeBase62(generateId);
    await this.create({
      longUrl: longUrlForm.longUrl,
      shortUrl: `${longUrlForm.domain}/${shortUrlString}`,
      alias: shortUrlString,
    });
    return `${longUrlForm.domain}/${shortUrlString}`;
  }

  async redirectUrl(shortUrlForm: string) {
    const shortUrl = shortUrlForm.split('/')?.at(-1);
    const result = await this.getLongUrl(shortUrl);
    if (!result) {
      throw new Error('Invalid Short URL!');
    }
    return result.longUrl;
  }

  async create(data: Prisma.UrlMappingCreateInput): Promise<UrlMapping> {
    return await this.prisma.urlMapping.create({
      data,
    });
  }

  async getShortUrl(
    input: Prisma.UrlMappingWhereUniqueInput,
  ): Promise<UrlMapping | null> {
    return await this.prisma.urlMapping.findUnique({
      where: {
        longUrl: input.longUrl,
      },
    });
  }

  async getLongUrl(input: string | undefined): Promise<UrlMapping | null> {
    return await this.prisma.urlMapping.findUnique({
      where: {
        shortUrl: input,
      },
    });
  }

  async getAlias(input: string): Promise<UrlMapping | null> {
    return await this.prisma.urlMapping.findUnique({
      where: {
        alias: input,
      },
    });
  }
}
