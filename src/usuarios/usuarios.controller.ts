import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuariosService } from './usuarios.service';
import { PaginatorDto, Public, Usuario } from '@/common';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('auth/register')
  @Public() // Hacemos publica esta ruta
  // @Res() importado desde @nestjs/common
  //! Response importado desde express (revisar en caso de error)
  async register(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @Res() response: Response,
  ) {
    const result = await this.usuariosService.register(createUsuarioDto);
    // Podemos mejorar nuestros mensajes de respuesta
    response
      .status(HttpStatus.CREATED)
      .json({ ok: true, result, msg: 'Created' });
  }

  @Post('auth/login')
  @Public() // Hacemos publica esta ruta
  async login(@Body() credenciales: LoginDto, @Res() response: Response) {
    const result = await this.usuariosService.login(credenciales);
    response.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Get()
  async findAll(@Query() paginator: PaginatorDto, @Res() response: Response) {
    const result = await this.usuariosService.findAll(paginator);
    response.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Res() response: Response,
  ) {
    const result = await this.usuariosService.findOne(id);
    response.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Usuario() usuario: UpdateUsuarioDto,
    @Res() response: Response,
  ) {
    const result = await this.usuariosService.update(
      id,
      updateUsuarioDto,
      usuario,
    );
    response.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Usuario() usuario: UpdateUsuarioDto,
    @Res() response: Response,
  ) {
    const result = await this.usuariosService.remove(id, usuario);
    response.status(HttpStatus.OK).json({ ok: true, result, msg: 'Approved' });
  }
}
