import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService, // Mock Prisma
          useValue: {
            urlMapping: {
              create: jest.fn().mockResolvedValue({ shortUrl: 'short.ly/xyz' }),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'DATABASE_URL') return 'postgres://test-db-url';
              return null;
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return shorlUrl', () => {
      expect(
        appController.createShortUrl({ longUrl: 'www.google.com' }),
      ).toBeTruthy();
    });
  });
});
