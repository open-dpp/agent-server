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
import { AiConfigurationModule } from './ai-configuration/ai-configuration.module';
import { PassportModule } from './passports/passport.module';
import { KeycloakAuthGuard } from './auth/keycloak-auth/keycloak-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { HttpModule } from '@nestjs/axios';

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
            KEYCLOAK_NETWORK_URL: z.string(),
            KEYCLOAK_REALM: z.string(),
            KEYCLOAK_PUBLIC_URL: z.string(),
            DPP_API_URL: z.string(),
            DPP_API_SERVICE_TOKEN: z.string(),
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
    AiConfigurationModule,
    AiModule,
    McpClientModule,
    PermissionsModule,
    AuthModule,
    PassportModule,
    HttpModule,
  ],
  providers: [
    ChatGateway,
    ChatService,
    {
      provide: APP_GUARD,
      useClass: KeycloakAuthGuard,
    },
    // KeycloakPermissionsGuard is now provided by PermissionsModule
  ],
})
export class AppModule {}
