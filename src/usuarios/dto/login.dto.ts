import { IsEmail, IsOptional, IsString } from 'class-validator';

// Con esta clase, controlamos el
// objeto recibido al hacer login
export class LoginDto {
  @IsEmail()
  correo: string;
  @IsString()
  contrasenia: string;
  @IsString()
  @IsOptional()
  nombre_completo: string;
}
