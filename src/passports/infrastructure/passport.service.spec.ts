import { Test, TestingModule } from '@nestjs/testing';
import { PassportService } from './passport.service';
import { Connection } from 'mongoose';
import { MongooseTestingModule } from '../../../test/mongo.testing.module';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { NotFoundInDatabaseException } from '../../exceptions/service.exceptions';
import { PassportDbSchema, PassportDoc } from './passport.schema';
import { Passport } from '../domain/passport';
import { passportFactory } from '../fixtures/passport.factory';

describe('PassportService', () => {
  let service: PassportService;
  let mongoConnection: Connection;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseTestingModule,
        MongooseModule.forFeature([
          {
            name: PassportDoc.name,
            schema: PassportDbSchema,
          },
        ]),
      ],
      providers: [PassportService],
    }).compile();
    service = module.get<PassportService>(PassportService);
    mongoConnection = module.get<Connection>(getConnectionToken());
  });

  it('fails if requested configuration could not be found', async () => {
    await expect(service.findOneOrFail(randomUUID())).rejects.toThrow(
      new NotFoundInDatabaseException(Passport.name),
    );
  });

  it('should save passport', async () => {
    const aiConfiguration = Passport.create(passportFactory.build());

    const { uuid } = await service.save(aiConfiguration);
    const found = await service.findOneOrFail(uuid);
    expect(found).toEqual(aiConfiguration);
  });

  afterAll(async () => {
    await mongoConnection.close();
    await module.close();
  });
});
