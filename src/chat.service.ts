// agent-server/src/chat.service.ts
import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { AiService } from './ai/ai.service';
import { McpClientService } from './mcp-client/mcp-client.service';
import { AiConfigurationService } from './ai-configuration/infrastructure/ai-configuration.service';
import { PassportService } from './passports/passport.service';

@Injectable()
export class ChatService {
  constructor(
    private mcpClientService: McpClientService,
    private aiService: AiService,
    private passportService: PassportService,
    private aiConfigurationService: AiConfigurationService,
  ) {}

  async askAgent(query: string, passportUuid: string) {
    const passport = await this.passportService.findOneOrFail(passportUuid);
    const aiConfiguration =
      await this.aiConfigurationService.findOneByOrganizationId(
        passport.ownedByOrganizationId,
      );

    if (!aiConfiguration?.isEnabled) {
      throw new Error('AI is not enabled');
    }
    const llm = this.aiService.getLLM(
      aiConfiguration.provider,
      aiConfiguration.model,
    );
    const tools = await this.mcpClientService.getTools();
    const agent = this.aiService.getAgent({
      llm,
      tools,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a helpful assistant. The current product passport has the UUID: ${passportUuid}`,
      ],
      ['human', '{input}'],
    ]);

    const chain = RunnableSequence.from([
      prompt,
      agent,
      (agentResponse: { messages: any[] }) => {
        const messages = agentResponse.messages || [];
        const lastMessage = messages[messages.length - 1];

        return lastMessage?.content || '';
      },
      new StringOutputParser(),
    ]);

    return await chain.invoke({ input: query });
  }
}
