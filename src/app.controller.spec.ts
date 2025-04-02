import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';
import { Domains } from '../utils/domains';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        PrismaService,
        ConfigService,
        // {
        //   provide: ConfigService,
        //   useValue: {
        //     get: jest.fn().mockImplementation((key: string) => {
        //       if (key === 'DATABASE_URL') return 'postgres://test-db-url';
        //       return null;
        //     }),
        //   },
        // },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return shorlUrl', () => {
      expect(
        appController.createShortUrl({
          longUrl: 'www.google.com',
          alias: 'string',
          domain: Domains['short-nr'],
        }),
      ).toBeTruthy();
    });
  });
});
