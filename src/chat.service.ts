// agent-server/src/chat.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';

import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
@Injectable()
export class ChatService implements OnModuleInit {
  private agent: any;

  async onModuleInit() {
    const client = new MultiServerMCPClient({
      throwOnLoadError: true,
      prefixToolNameWithServerName: false,
      additionalToolNamePrefix: '',
      mcpServers: {
        productPassport: {
          transport: 'sse',
          url: 'http://localhost:5000/sse',
          reconnect: {
            enabled: true,
            maxAttempts: 5,
            delayMs: 2000,
          },
        },
      },
    });
    const tools = await client.getTools();
    console.log(tools);

    const llm = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0,
    });

    this.agent = createReactAgent({ llm, tools });
  }

  async askAgent(query: string) {
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', 'You are a helpful assistant'],
      ['human', '{input}'],
    ]);

    const chain = RunnableSequence.from([
      prompt,
      this.agent,
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
