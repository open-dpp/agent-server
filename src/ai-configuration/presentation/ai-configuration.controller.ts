import { Body, Controller, Get, Param, Put, Request } from '@nestjs/common';
import { PermissionsService } from '../../permissions/permissions.service';
import { AiConfigurationService } from '../infrastructure/ai-configuration.service';
import {
  aiConfigurationToDto,
  AiConfigurationUpsertDto,
  AiConfigurationUpsertDtoSchema,
} from './dto/ai-configuration.dto';
import { AuthRequest } from '../../auth/auth-request';
import { ZodValidationPipe } from '../../exceptions/zod-validation.pipeline';
import { AiConfiguration } from '../domain/ai-configuration';

@Controller('organizations/:organizationId/configurations')
export class AiConfigurationController {
  constructor(
    private aiConfigurationService: AiConfigurationService,
    private permissionsService: PermissionsService,
  ) {}

  @Put()
  async upsertConfiguration(
    @Param('organizationId') organizationId: string,
    @Request() req: AuthRequest,
    @Body(new ZodValidationPipe(AiConfigurationUpsertDtoSchema))
    aiConfigurationUpsertDto: AiConfigurationUpsertDto,
  ) {
    await this.permissionsService.canAccessOrganizationOrFail(
      organizationId,
      req.authContext,
    );

    let aiConfiguration =
      await this.aiConfigurationService.findOneByOrganizationId(organizationId);

    if (aiConfiguration) {
      aiConfiguration.update(aiConfigurationUpsertDto);
    } else {
      aiConfiguration = AiConfiguration.create({
        ownedByOrganizationId: organizationId,
        createdByUserId: req.authContext.keycloakUser.sub,
        provider: aiConfigurationUpsertDto.provider,
        model: aiConfigurationUpsertDto.model,
        isEnabled: aiConfigurationUpsertDto.isEnabled,
      });
    }

    return aiConfigurationToDto(
      await this.aiConfigurationService.save(aiConfiguration),
    );
  }

  @Get()
  async findConfigurationByOrganization(
    @Param('organizationId') organizationId: string,
    @Request() req: AuthRequest,
  ) {
    await this.permissionsService.canAccessOrganizationOrFail(
      organizationId,
      req.authContext,
    );
    return aiConfigurationToDto(
      await this.aiConfigurationService.findOneByOrganizationIdOrFail(
        organizationId,
      ),
    );
  }
}
