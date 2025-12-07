import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

const bootstrap = async () => {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT');
    const baseUrl = configService.get<string>('BASE_URL');

    // Set global prefix if BASE_URL is provided
    if (baseUrl) {
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
