import { Injectable } from '@nestjs/common';
import { CreateEdicionesDto } from './dto/create-ediciones.dto';
import { UpdateEdicionesDto } from './dto/update-ediciones.dto';

@Injectable()
export class EdicionesService {
  create(createEdicioneDto: CreateEdicionesDto) {
    return 'This action adds a new edicione';
  }

  findAll() {
    return `This action returns all ediciones`;
  }

  findOne(id: number) {
    return `This action returns a #${id} edicione`;
  }

  update(id: number, updateEdicioneDto: UpdateEdicionesDto) {
    return `This action updates a #${id} edicione`;
  }

  remove(id: number) {
    return `This action removes a #${id} edicione`;
  }
}
