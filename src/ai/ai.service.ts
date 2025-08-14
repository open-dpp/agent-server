import { Injectable } from '@nestjs/common';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { StructuredToolInterface } from '@langchain/core/tools';
import { ConfigService } from '@nestjs/config';
import { ChatMistralAI } from '@langchain/mistralai';

@Injectable()
export class AiService {
  constructor(private readonly configService: ConfigService) {}

  getLLM() {
    // const model = new ChatOllama({
    //   baseUrl: 'http://localhost:11434',
    //   model: 'tinyllama',
    // });
    // return model;

    // return new ChatOpenAI({
    //   model: 'gpt-4o-mini',
    //   configuration: {
    //     // baseURL: this.configService.get('OPENAI_API_URL'),
    //     apiKey: this.configService.get('OPENAI_API_KEY'),
    //   },
    // });
    return new ChatMistralAI({
      model: 'codestral-latest',
      temperature: 0,
      apiKey: this.configService.get('MISTRAL_API_KEY'),
    });
  }

  getAgent({
    llm,
    tools,
  }: {
    llm: ChatMistralAI;
    tools: StructuredToolInterface[];
  }) {
    return createReactAgent({
      llm,
      tools,
    });
  }
}
