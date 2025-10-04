import { Global, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { RedisModule } from '../redis/redis.module';
import { TasksGateway } from './tasks.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TaskAssignmentsModule } from '../task_assignments/task_assignments.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../../queue-constants';
import { TasksEventsProcessor } from './tasks-events.processor';

@Global()
@Module({
  imports: [RedisModule, JwtModule, BullModule.registerQueue({
    name: QUEUE_NAMES.TASK_EVENTS
  })],
  controllers: [TasksController],
  providers: [TasksService, TasksGateway, TasksEventsProcessor],
  exports: [TasksGateway]
})
export class TasksModule {}
