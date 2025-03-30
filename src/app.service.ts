import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { encodeBase62 } from 'utils/base64EncodingDecoding';
import { createUniqueId } from 'utils/uniqueIdGenerator';
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
    const machineId = this.configService.get<number>('MACHINE_ID') || 1;
    const dataCentreId = this.configService.get<number>('DATA_CENTRE_ID') || 1;
    const generateId = createUniqueId(machineId, dataCentreId);
    const shortUrlString = encodeBase62(generateId);
    try {
      await this.create({
        longUrl: longUrlForm.longUrl,
        shortUrl: shortUrlString,
      });
    } catch (error) {
      throw new Error('database operation during creating document');
    }
    return `https://atul-url-shortner/${shortUrlString}`;
  }

  async create(data: Prisma.UrlMappingCreateInput): Promise<UrlMapping> {
    return this.prisma.urlMapping.create({
      data,
    });
  }
}
