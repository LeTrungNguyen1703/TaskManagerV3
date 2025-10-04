import { Module } from '@nestjs/common';
import { TaskAssignmentsService } from './task_assignments.service';
import { TaskAssignmentsController } from './task_assignments.controller';
import { TasksModule } from '../tasks/tasks.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../../queue-constants';

@Module({
  controllers: [TaskAssignmentsController],
  providers: [TaskAssignmentsService],
  exports: [TaskAssignmentsService],
  imports: [BullModule.registerQueue({
    name: QUEUE_NAMES.TASK_EVENTS
  })],
})
export class TaskAssignmentsModule {}
