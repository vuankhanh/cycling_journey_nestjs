import { Test, TestingModule } from '@nestjs/testing';
import { PolylineService } from './polyline.service';

describe('PolylineService', () => {
  let service: PolylineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PolylineService],
    }).compile();

    service = module.get<PolylineService>(PolylineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
