import { Module } from '@nestjs/common';
import { EdicionesService } from './ediciones.service';
import { EdicionesController } from './ediciones.controller';

@Module({
  controllers: [EdicionesController],
  providers: [EdicionesService],
})
export class EdicionesModule {}
