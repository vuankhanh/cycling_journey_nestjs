import { RouteExistsGuard } from './route_exists.guard';

describe('RouteExistsGuard', () => {
  it('should be defined', () => {
    expect(new RouteExistsGuard()).toBeDefined();
  });
});
