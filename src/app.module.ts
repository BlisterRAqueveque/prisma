import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GUARD_KEY } from './common';
import { PrismaModule } from './prisma/prisma.module';
import { JwtGuard } from './usuarios';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EdicionesModule } from './ediciones/ediciones.module';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: GUARD_KEY,
      useClass: JwtGuard,
    },
  ],
  imports: [PrismaModule, UsuariosModule, EdicionesModule],
})
export class AppModule {}
