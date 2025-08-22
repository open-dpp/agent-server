import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsModule } from '../permissions/permissions.module';
import {
  AiConfigurationDbSchema,
  AiConfigurationDoc,
} from './infrastructure/ai-configuration.schema';
import { AiConfigurationController } from './presentation/ai-configuration.controller';
import { AiConfigurationService } from './infrastructure/ai-configuration.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: AiConfigurationDoc.name,
        schema: AiConfigurationDbSchema,
      },
    ]),
    PermissionsModule,
  ],
  controllers: [AiConfigurationController],
  providers: [AiConfigurationService],
  exports: [AiConfigurationService],
})
export class AiConfigurationModule {}
