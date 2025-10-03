import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { RedisModule } from '../redis/redis.module';
import { TasksGateway } from './tasks.gateway';

@Module({
  imports: [RedisModule], // Import RedisModule để có CACHE_MANAGER
  controllers: [TasksController],
  providers: [TasksService, TasksGateway],
})
export class TasksModule {}
