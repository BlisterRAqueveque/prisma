import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { AuthService } from './auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from 'src/configuration';
import { JwtPassport } from './auth/jwt.passport';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService, AuthService, JwtPassport],
  imports: [
    JwtModule.register({
      secret: envs.jwt_seed,
      signOptions: { expiresIn: '24h' },
    }),
    PrismaModule,
  ],
})
export class UsuariosModule {}
