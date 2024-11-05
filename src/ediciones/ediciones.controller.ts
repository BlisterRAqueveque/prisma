import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EdicionesService } from './ediciones.service';
import { CreateEdicionesDto } from './dto/create-ediciones.dto';
import { UpdateEdicionesDto } from './dto/update-ediciones.dto';

@Controller('ediciones')
export class EdicionesController {
  constructor(private readonly edicionesService: EdicionesService) {}

  @Post()
  create(@Body() createEdicioneDto: CreateEdicionesDto) {
    return this.edicionesService.create(createEdicioneDto);
  }

  @Get()
  findAll() {
    return this.edicionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.edicionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEdicioneDto: UpdateEdicionesDto) {
    return this.edicionesService.update(+id, updateEdicioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.edicionesService.remove(+id);
  }
}
