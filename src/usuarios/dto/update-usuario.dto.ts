import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsNumber() // Debe ser número
  @IsPositive() // Positivo
  // Transformamos su tipo a Number
  @Type(() => Number)
  id: number;
}
