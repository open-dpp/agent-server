// agent-server/src/chat.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('userMessage')
  async handleMessage(@MessageBody() message: string) {
    console.log('Received message:', message);
    console.time('handleMessage');
    const reply = await this.chatService.askAgent(message);
    this.server.emit('botMessage', reply);
    console.timeEnd('handleMessage');
  }
}
