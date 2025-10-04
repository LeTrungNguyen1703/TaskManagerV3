import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtGuard } from '../auth/ws-auth.guard';
import { Logger, OnModuleInit, Req, UseGuards } from '@nestjs/common';
import { JwtPayload } from '../auth/interfaces/jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { TaskStatus } from '@prisma/client';
import { TasksModule } from './tasks.module';
import { TaskInterface } from './tasks.controller';
import { jwtConstants } from '../auth/constants';
import { TaskAssignmentsService } from '../task_assignments/task_assignments.service';

@WebSocketGateway()
export class TasksGateway implements OnGatewayConnection, OnModuleInit {
  constructor(
    private readonly jwtService: JwtService,
    private readonly taskAssignments: TaskAssignmentsService,
  ) {}

  private readonly logger = new Logger(TasksGateway.name);
  private client: Socket & { user: JwtPayload };
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket & { user: JwtPayload }) {
    const token =
      client.handshake.headers.authorization || client.handshake.auth.token;

    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: jwtConstants().secret,
      });
      // Gắn userId vào client để dùng về sau
      (client as any).user = payload;

      this.logger.log(
        `Client connected: ${client.id}, User ID: ${payload.sub}`,
      );
    } catch (e) {
      client.disconnect(true);
    }
    this.client = client;
  }

  onModuleInit() {
    this.logger.log('TasksGateway initialized');
  }

  @SubscribeMessage('joinTask')
  async handleJoinTask(
    @ConnectedSocket() client: Socket & { user: JwtPayload },
  ) {
    const userId = client.user.sub;

    const tasksList = await this.taskAssignments.findTaskByUserId(userId);
    tasksList.forEach((task) => {
      client.join(`tasks:${task.task_id}`);
      this.logger.log(`User ID: ${userId} joined room tasks:${task.task_id}`);
    });
  }

  handleTaskStatusUpdate(data: {
    taskId: number;
    status: TaskStatus;
    title: string;
  }) {
    this.server.to(`tasks:${data.taskId}`).emit('tasksStatusUpdated', data);
  }
}
