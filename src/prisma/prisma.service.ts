import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// Extendemos la clase de prisma
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Mejora los logs en la aplicación
  private readonly logger = new Logger('Prisma service');

  onModuleInit() {
    // Desde la misma instancia de esta clase, nos conectamos por
    // única vez a la base de datos:
    this.$connect();
    this.logger.log('Connected to database');
  }
}
