// agent-server/src/app.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';
import { McpClientModule } from './mcp-client/mcp-client.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) =>
        z
          .object({
            OLLAMA_URL: z.string(),
            MISTRAL_API_KEY: z.string(),
            MCP_URL: z.string(),
            PORT: z.string().default('5001'),
          })
          .parse(config),
    }),
    AiModule,
    McpClientModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class AppModule {}
