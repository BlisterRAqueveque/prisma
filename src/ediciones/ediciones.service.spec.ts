import { Test, TestingModule } from '@nestjs/testing';
import { EdicionesService } from './ediciones.service';

describe('EdicionesService', () => {
  let service: EdicionesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EdicionesService],
    }).compile();

    service = module.get<EdicionesService>(EdicionesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
