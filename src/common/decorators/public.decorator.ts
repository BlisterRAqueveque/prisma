import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../keys/public.key';

// Este decorador solo agrega metadatos en las rutas
// Pasa la llave pública, que podríamos pasar el string
// plano, pero es una buena práctica, usar constantes
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
