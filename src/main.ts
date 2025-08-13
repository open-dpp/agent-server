import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
  });
  const port = Number(configService.get('PORT', '5001'));
  await app.listen(port, '0.0.0.0');
}

if (require.main === module) {
  bootstrap();
}
