import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { PayloadInterface } from '@/common';

@Injectable()
export class AuthService {
  //! Funciones para los JWT ----------------------------->
  constructor(private readonly jwtService: JwtService) {}

  crearJwt(usuario: UpdateUsuarioDto): string {
    // Desestructuramos el objeto
    const { id: sub, correo } = usuario || {};
    // Creamos el payload
    const payload: PayloadInterface = {
      sub, // Pasamos las variables
      correo,
    };

    return this.jwtService.sign(payload);
  }

  comprobarJwt(token: string): PayloadInterface {
    return this.jwtService.verify(token);
  }
  //! Funciones para los JWT ----------------------------->

  //! Hash de contraseñas -------------------------------->
  hashContrasenia(contrasenia: string): Promise<string> {
    const saltOrRounds = 12;
    return bcrypt.hash(contrasenia, saltOrRounds);
  }

  compararContrasenia(
    contrasenia: string,
    hashContrasenia: string,
  ): Promise<boolean> {
    return bcrypt.compare(contrasenia, hashContrasenia);
  }
  //! Hash de contraseñas -------------------------------->
}
