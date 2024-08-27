import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';

export function startApp({
  beforeInit,
}: { beforeInit?: (app: INestApplication) => void } = {}) {
  let _app: INestApplication;
  beforeEach(async () => {
    const moduleBuilder: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    _app = moduleBuilder.createNestApplication();
    beforeInit && beforeInit(_app);
    await _app.init();
  });

  afterEach(async () => {
    if (_app) {
      await _app.close();
    }
  });

  return {
    get app() {
      return _app;
    },
  };
}
