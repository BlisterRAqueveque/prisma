import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthService } from './auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { PaginatorDto } from '@/common';
import { CreateEdicionesDto } from '@/ediciones/dto/create-ediciones.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService, // También vamos a usar el servicio de auth
  ) {}

  //! Servicios de autenticación ------------------>
  async register(createUsuarioDto: CreateUsuarioDto) {
    // Desestructuramos el objeto
    const { contrasenia, correo } = createUsuarioDto || {};
    // Buscamos en los registros si ya hay un usuario con ese correo
    const usuario = await this.prisma.usuario.findFirst({ where: { correo } });
    // Si existe, lanzamos el error
    if (usuario) throw new BadRequestException('Correo already taken');
    // En caso que no se encuentre la contraseña (no debería pasar si se configuro bien el DTO)
    if (!contrasenia) throw new BadRequestException('Some params are required');
    // Hasheamos la contraseña
    const hashPassword = await this.auth.hashContrasenia(contrasenia);
    // Creamos el usuario
    const newUsuario = await this.prisma.usuario.create({
      data: { ...createUsuarioDto, contrasenia: hashPassword },
    });
    // Borramos la propiedad de la contraseña
    delete newUsuario['contrasenia'];
    // Retornamos el usuario creado
    return newUsuario;
  }

  /**
   * @description
   * Realiza el login del usuario, y devuelve el token
   * @param credenciales Credenciales del usuario { correo, contrasenia }
   * @returns { token, usuario }
   */
  async login(credenciales: LoginDto) {
    // Desestructuramos el objeto
    const { correo, contrasenia } = credenciales || {};
    // Buscamos el usuario en la base de datos
    const usuario = await this.prisma.usuario.findFirst({ where: { correo } });
    //! Si no existe, no autorizado
    if (!usuario) throw new UnauthorizedException('User not found');
    // Comparamos la contraseña
    const isPassword = await this.auth.compararContrasenia(
      contrasenia,
      usuario.contrasenia,
    );
    //! Si no es igual, no autorizado
    if (!isPassword) throw new UnauthorizedException('Wrong credentials');
    // Creamos el token
    const token = this.auth.crearJwt(usuario);
    // Eliminamos la contraseña del objeto
    delete usuario['contrasenia'];
    // Retornamos el token y el usuario
    return { token, usuario };
  }
  //! Servicios de autenticación ------------------>

  async findAll(paginator: PaginatorDto) {
    // Desestructuramos el objeto
    const { page, perPage } = paginator || {};
    // Creamos una variable let que si no tiene datos
    // devolverá undefined
    let metadata;
    // Traemos la cantidad de registros
    const totalPages = await this.prisma.usuario.count({
      // Filtrando solo los disponibles
      where: { disponible: true },
    });
    // Dividimos por la cantidad por página
    const lastPage = Math.ceil(totalPages / perPage);
    // Y si existen la página, y cantidad por página
    // devolvemos los metadatos
    if (page && perPage)
      metadata = {
        page, // El número de página
        totalPages, // Total de páginas
        lastPage, // Cual sería la última página
      };
    // Buscamos los datos
    const data = await this.prisma.usuario.findMany({
      // En caso de que no existan estos datos, trae todo directamente
      skip: page ? (page - 1) * perPage : undefined,
      take: perPage ? perPage : undefined,
      // Filtramos por disponible
      where: { disponible: true },
    });

    // Y retornamos la información
    return {
      data,
      // Los metadatos dependen de la información
      // provista por el paginador
      metadata: metadata ? metadata : { totalRecords: totalPages },
    };
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id, disponible: true },
    });
    if (!usuario) throw new NotFoundException('User not found');
    return usuario;
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
    usuario: UpdateUsuarioDto,
  ) {
    // Desestructuramos el objeto, y limpiamos el valor del ID
    const { id: __, ...data } = updateUsuarioDto;
    // Creamos el objeto "edicion", en el ID del usuario
    // editor (usuario logeado)
    const edicion: CreateEdicionesDto = {
      descripcion: 'Editado',
      usuarioEditorId: usuario.id,
    };
    // Insertamos los valores en la base de datos
    const result = await this.prisma.usuario.update({
      where: { id },
      data: {
        ...data,
        ediciones: {
          /** 
           * -------------------------------------->
             E indicamos que cree el objeto edicion
             en cascada. El ID del registro editado
             se inserta automáticamente mediante esta
             relación. El ID del usuario editor lo
             agregamos nosotros en el paso anterior
           * -------------------------------------->
          */
          create: edicion,
        },
      },
    });
    // No se olviden de eliminar la contraseña del objeto a retornar
    delete result['contrasenia'];
    return result;
  }

  async remove(id: number, usuario: UpdateUsuarioDto) {
    const edicion: CreateEdicionesDto = {
      descripcion: 'Eliminado',
      usuarioEditorId: usuario.id,
    };
    const result = await this.prisma.usuario.update({
      where: { id },
      data: {
        // Cambiamos su disponibilidad
        disponible: false,
        ediciones: {
          // Insertamos la edición en cascada
          create: edicion,
        },
      },
    });
    delete result['contrasenia'];
    return result;
  }

  async getUserByToken(token: string) {
    try {
      const payload = this.auth.comprobarJwt(token);
      if (!payload) throw new UnauthorizedException('Invalid token');
      return this.findOne(payload.sub);
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
