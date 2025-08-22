import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'reflect-metadata';
import { ConfigService } from '@nestjs/config';
import {
  NotFoundExceptionFilter,
  NotFoundInDatabaseExceptionFilter,
  ValueErrorFilter,
} from './exceptions/exception.handler';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalFilters(
    new NotFoundInDatabaseExceptionFilter(),
    new NotFoundExceptionFilter(),
    new ValueErrorFilter(),
  );
  app.enableCors({
    origin: '*',
  });
  const port = Number(configService.get('PORT', '5001'));
  await app.listen(port, '0.0.0.0');
}

if (require.main === module) {
  bootstrap();
}
