import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

import { AppModule } from './app.module';

const bootstrap = async () => {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT');
    const baseUrl = configService.get<string>('BASE_URL');

    if (baseUrl) {
      app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.path === '/') {
          return res.redirect(baseUrl);
        }
        next();
      });
      app.setGlobalPrefix(baseUrl);
    }

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.listen(port!);
    console.log(`Server is running on: http://localhost:${port}${baseUrl}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

void bootstrap();
