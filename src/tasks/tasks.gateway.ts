import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/ws-auth.guard';
import { Logger, Req, UseGuards } from '@nestjs/common';
import { JwtPayload } from '../auth/interfaces/jwtPayload';

@WebSocketGateway()
export class TasksGateway implements OnGatewayConnection {
  private readonly logger = new Logger(TasksGateway.name);

  @WebSocketServer()
  server: Server;

  @UseGuards(WsJwtGuard)
  handleConnection(client: Socket & { user: JwtPayload }) {
    const userId = client.user?.sub;
    this.logger.log(`Client connected: ${client.id}, User ID: ${userId}`);
    if (!userId) {
      client.disconnect(true);
      this.logger.warn(`Client ${client.id} disconnected due to missing user ID`);
    }

  }
}
