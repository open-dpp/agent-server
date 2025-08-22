// ws-exception.filter.ts
import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';

@Catch(Error)
export class SocketIoExceptionFilter implements WsExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    // Normalize error format
    client.emit('errorMessage', error.message);
  }
}
