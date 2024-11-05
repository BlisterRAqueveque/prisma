import { Test, TestingModule } from '@nestjs/testing';
import { EdicionesController } from './ediciones.controller';
import { EdicionesService } from './ediciones.service';

describe('EdicionesController', () => {
  let controller: EdicionesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EdicionesController],
      providers: [EdicionesService],
    }).compile();

    controller = module.get<EdicionesController>(EdicionesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
