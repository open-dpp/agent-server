// agent-server/src/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  private readonly logger: Logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('userMessage')
  async handleMessage(
    @MessageBody() message: { msg: string; passportUUID: string },
  ) {
    const startTime = Date.now();
    this.logger.log('Start to process message:', message);
    const reply = await this.chatService.askAgent(
      message.msg,
      message.passportUUID,
    );
    this.server.emit('botMessage', reply);
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    this.logger.log('Processing time:', executionTime, 'ms');
  }
}
