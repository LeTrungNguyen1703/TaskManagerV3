import { Module } from '@nestjs/common';
import { TaskAssignmentsService } from './task_assignments.service';
import { TaskAssignmentsController } from './task_assignments.controller';

@Module({
  controllers: [TaskAssignmentsController],
  providers: [TaskAssignmentsService],
  exports: [TaskAssignmentsService],
})
export class TaskAssignmentsModule {}
