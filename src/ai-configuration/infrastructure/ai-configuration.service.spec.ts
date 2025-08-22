import { Test, TestingModule } from '@nestjs/testing';
import { AiConfigurationService } from './ai-configuration.service';
import { Connection } from 'mongoose';
import { MongooseTestingModule } from '../../../test/mongo.testing.module';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import { NotFoundInDatabaseException } from '../../exceptions/service.exceptions';
import {
  AiConfigurationDbSchema,
  AiConfigurationDoc,
} from './ai-configuration.schema';
import { AiConfiguration } from '../domain/ai-configuration';
import { aiConfigurationFactory } from '../fixtures/ai-configuration-props.factory';

describe('AiConfigurationService', () => {
  let service: AiConfigurationService;
  let mongoConnection: Connection;
  let module: TestingModule;

  const mockNow = new Date('2025-01-01T12:00:00Z').getTime();

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => mockNow);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseTestingModule,
        MongooseModule.forFeature([
          {
            name: AiConfigurationDoc.name,
            schema: AiConfigurationDbSchema,
          },
        ]),
      ],
      providers: [AiConfigurationService],
    }).compile();
    service = module.get<AiConfigurationService>(AiConfigurationService);
    mongoConnection = module.get<Connection>(getConnectionToken());
  });

  it('fails if requested passport template could not be found', async () => {
    await expect(service.findOneOrFail(randomUUID())).rejects.toThrow(
      new NotFoundInDatabaseException(AiConfiguration.name),
    );
  });

  it('should create passport template', async () => {
    const aiConfiguration = AiConfiguration.loadFromDb(
      aiConfigurationFactory.build(),
    );

    const { id } = await service.save(aiConfiguration);
    const found = await service.findOneOrFail(id);
    expect(found).toEqual(aiConfiguration);
  });
  //
  // it('should find all passport templates', async () => {
  //   const passportTemplate = PassportTemplate.loadFromDb(
  //     passportTemplatePropsFactory.build(),
  //   );
  //   const passportTemplate2 = PassportTemplate.loadFromDb(
  //     passportTemplatePropsFactory.build({ id: randomUUID() }),
  //   );
  //
  //   await service.save(passportTemplate);
  //   await service.save(passportTemplate2);
  //   const found = await service.findAll();
  //   expect(found).toContainEqual(passportTemplate);
  //   expect(found).toContainEqual(passportTemplate2);
  // });

  afterAll(async () => {
    await mongoConnection.close();
    await module.close();
  });
});
