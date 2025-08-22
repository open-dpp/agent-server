import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsModule } from '../permissions/permissions.module';
import { AiConfigurationDoc } from './infrastructure/ai-configuration.schema';
import { AiConfigurationDtoSchema } from './presentation/dto/ai-configuration.dto';
import { AiConfigurationController } from './presentation/ai-configuration.controller';
import { AiConfigurationService } from './infrastructure/ai-configuration.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AiConfigurationDoc.name,
        schema: AiConfigurationDtoSchema,
      },
    ]),
    PermissionsModule,
  ],
  controllers: [AiConfigurationController],
  providers: [AiConfigurationService],
  exports: [AiConfigurationService],
})
export class AiConfigurationModule {}
