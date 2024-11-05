import { PartialType } from '@nestjs/mapped-types';
import { CreateEdicionesDto } from './create-ediciones.dto';

export class UpdateEdicionesDto extends PartialType(CreateEdicionesDto) {
  id: number;
}
