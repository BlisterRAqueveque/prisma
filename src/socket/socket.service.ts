import { UsuariosService } from '@/usuarios/usuarios.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
  constructor(private readonly usuarioService: UsuariosService) {}

  /**
   * @description
   * Return the user by his token
   * @param token User's token
   * @returns User
   */
  returnUserInfo(token: string) {
    return this.usuarioService.getUserByToken(token);
  }
}
