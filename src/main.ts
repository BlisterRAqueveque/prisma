import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common';
import { envs } from './configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Para mejorar los logs usamos logger
  const logger = new Logger('Main');
  // Colocamos el filtro de excepciones de manera global, para todas
  // las rutas:
  app.useGlobalFilters(new HttpExceptionFilter());

  // Agregamos un prefix a los endpoints
  app.setGlobalPrefix('api/v1');
  // Usamos global pipes para las validaciones
  app.useGlobalPipes(
    new ValidationPipe({
      // Permite solo el ingreso de propiedades seteadas en los DTO
      whitelist: true,
      forbidNonWhitelisted: true,
      // Transforma los valores recibidos
      transform: true,
    }),
  );
  // Usamos el port desde el env
  await app.listen(envs.port);

  logger.log(`Server running on port: ${envs.port}`);
}
bootstrap();
