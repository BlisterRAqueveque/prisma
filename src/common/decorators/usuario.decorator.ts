import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Usuario = createParamDecorator(
  // Desde el contexto de la app (ctx)
  (data: unknown, ctx: ExecutionContext) => {
    // podemos obtener la request
    const request = ctx.switchToHttp().getRequest();
    // y de esa request, obtener el usuario que
    // generamos desde el jwt.passport.ts
    return request.user;
  },
);
