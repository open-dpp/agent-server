import { Injectable } from '@nestjs/common';
import { DppApiClient } from '@open-dpp/api-client';
import { ConfigService } from '@nestjs/config';
import { Passport } from './domain/passport';

@Injectable()
export class PassportService {
  private readonly dppApiClient: DppApiClient;

  constructor(configService: ConfigService) {
    const baseURL = configService.get<string>('DPP_API_URL');
    if (!baseURL) {
      throw new Error('DPP_API_URL is not set');
    }
    this.dppApiClient = new DppApiClient({ baseURL });
  }

  async findOneOrFail(uuid: string): Promise<Passport | undefined> {
    const response =
      await this.dppApiClient.uniqueProductIdentifiers.getMetadata(uuid);
    const { organizationId } = response.data;
    return Passport.create({
      uuid,
      ownedByOrganizationId: organizationId,
    });
  }
}
