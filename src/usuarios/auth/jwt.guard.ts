import { IS_PUBLIC_KEY } from '@/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
/* Extendemos esta clase desde el AuthGuard, usando JWT */
export class JwtGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  // Función nativa de la clase CanActivate
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Obtenemos los metadatos de las rutas
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY /* comparamos con la key que creamos */,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      // Y si la ruta tiene ese metadato, lo deja pasar
      return true;
    }
    // Caso contrario, activa el Passport
    return super.canActivate(context);
  }
}
