import { randomUUID } from 'crypto';
import { ValueError } from '../../exceptions/domain.errors';

export enum AiProvider {
  Ollama = 'ollama',
  Mistral = 'mistral',
}

const mistralModels = ['codestral-latest'];
const ollamaModels = ['qwen3:0.6b'];

export type AiConfigurationCreationProps = {
  provider: AiProvider;
  model: string;
  ownedByOrganizationId: string;
  createdByUserId: string;
  isEnabled: boolean;
};

export type AiConfigurationProps = AiConfigurationCreationProps & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export class AiConfiguration {
  private constructor(
    public readonly id: string,
    public readonly ownedByOrganizationId: string,
    public readonly createdByUserId: string,
    public readonly provider: AiProvider,
    public readonly model: string,
    public readonly isEnabled: boolean,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {
    const validModels =
      provider === AiProvider.Ollama ? ollamaModels : mistralModels;
    if (!validModels.includes(model)) {
      throw new ValueError(`Invalid model ${model} for provider ${provider}`);
    }
  }

  static create(data: AiConfigurationCreationProps): AiConfiguration {
    const now = new Date(Date.now());
    return new AiConfiguration(
      randomUUID(),
      data.ownedByOrganizationId,
      data.createdByUserId,
      data.provider,
      data.model,
      data.isEnabled,
      now,
      now,
    );
  }

  static loadFromDb(data: AiConfigurationProps): AiConfiguration {
    return new AiConfiguration(
      data.id,
      data.ownedByOrganizationId,
      data.createdByUserId,
      data.provider,
      data.model,
      data.isEnabled,
      data.createdAt,
      data.updatedAt,
    );
  }
}
