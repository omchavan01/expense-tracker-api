import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

const bootstrap = async () => {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT');

    await app.listen(port!);
    console.log(`Server is running on : http://localhost:${port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void bootstrap();
