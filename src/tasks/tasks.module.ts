import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { RedisModule } from '../redis/redis.module';
import { TasksGateway } from './tasks.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TaskAssignmentsModule } from '../task_assignments/task_assignments.module';

@Module({
  imports: [RedisModule, JwtModule, TaskAssignmentsModule], // Import RedisModule để có CACHE_MANAGER
  controllers: [TasksController],
  providers: [TasksService, TasksGateway],
})
export class TasksModule {}
