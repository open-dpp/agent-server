// agent-server/src/chat.service.ts
import { Injectable } from '@nestjs/common';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { AiModel, AiService } from './ai/ai.service';
import { McpClientService } from './mcp-client/mcp-client.service';

@Injectable()
export class ChatService {
  constructor(
    private mcpClientService: McpClientService,
    private aiService: AiService,
  ) {}

  async askAgent(query: string, passportUuid: string) {
    const llm = this.aiService.getLLM(AiModel.Mistral);
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
