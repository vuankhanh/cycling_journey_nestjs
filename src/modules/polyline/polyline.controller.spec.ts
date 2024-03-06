import { Test, TestingModule } from '@nestjs/testing';
import { PolylineController } from './polyline.controller';

describe('PolylineController', () => {
  let controller: PolylineController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolylineController],
    }).compile();

    controller = module.get<PolylineController>(PolylineController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
