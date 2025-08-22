// agent-server/src/app.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { McpClientModule } from './mcp-client/mcp-client.module';
import { AiModule } from './ai/ai.module';
import { PermissionsModule } from './permissions/permissions.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { generateMongoConfig } from './database/config';

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
            DB_HOST: z.string(),
            DB_PORT: z.string(),
            DB_USERNAME: z.string(),
            DB_PASSWORD: z.string(),
            DB_DATABASE: z.string(),
          })
          .parse(config),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...generateMongoConfig(configService),
      }),
      inject: [ConfigService],
    }),
    AiModule,
    McpClientModule,
    PermissionsModule,
    AuthModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class AppModule {}
