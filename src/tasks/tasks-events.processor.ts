import { QUEUE_NAMES, TASK_JOB_NAMES } from '../../queue-constants';
import { Logger } from '@nestjs/common';
import { TasksGateway } from './tasks.gateway';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor(QUEUE_NAMES.TASK_EVENTS)
export class TasksEventsProcessor extends WorkerHost {
  private readonly logger = new Logger(TasksEventsProcessor.name);

  constructor(private taskGateway: TasksGateway) {
    super();
  }

  async process(job: Job, token?: string): Promise<any> {
    switch (job.name) {
      case TASK_JOB_NAMES.MEMBER_ADDED: {
        return await this.handleMemberAdded(job);
      }
    }
  }

  private async handleMemberAdded(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} for task ${job.data.taskId} - Adding member ${job.data.userId}`,
    );

    const { taskId, userId } = job.data;
    try {
      this.taskGateway.handleUserAssignedToTask(job.data);
      return {
        success: true,
        taskId: taskId,
        userId: userId,
        processedAt: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Failed to process job ${job.id} of type ${job.name} for task ${taskId} - Error: ${error.message}`,
      );
      throw error;
    }
  }
}
