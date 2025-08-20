import { ChatOllama } from '@langchain/ollama';
import { Injectable } from '@nestjs/common';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { StructuredToolInterface } from '@langchain/core/tools';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  getLLM() {
    return new ChatOllama({
      model: 'qwen3:0.6b',
      baseUrl: 'http://91.99.52.50:11434',
    });
  }

  getAgent({
    llm,
    tools,
  }: {
    llm: ChatOllama;
    tools: StructuredToolInterface[];
  }) {
    return createReactAgent({
      llm,
      tools,
    });
  }
}
