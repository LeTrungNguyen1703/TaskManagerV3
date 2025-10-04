import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskAssignmentDto } from './dto/create-task_assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update-task_assignment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TasksGateway } from '../tasks/tasks.gateway';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES, TASK_JOB_NAMES } from '../../queue-constants';

@Injectable()
export class TaskAssignmentsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUE_NAMES.TASK_EVENTS)
    private readonly taskEventsQueue: Queue,
  ) {}

  async create(createTaskAssignmentDto: CreateTaskAssignmentDto) {
    const taskAssignment = await this.prisma.task_assignments.create({
      data: createTaskAssignmentDto,
      include: {
        users: {
          select: {
            username: true,
            email: true,
          },
        },
        tasks: {
          select: {
            title: true,
            description: true,
          },
        },
      },
    });

    await this.taskEventsQueue.add(
      TASK_JOB_NAMES.MEMBER_ADDED,
      {
        taskId: taskAssignment.task_id,
        userId: createTaskAssignmentDto.user_id,
        username: taskAssignment.users.username,
        email: taskAssignment.users.email,
        taskTitle: taskAssignment.tasks.title,
        timestamp: new Date(),
      } ,
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000, // 2 seconds
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return taskAssignment;
  }

  async findAll() {
    return this.prisma.task_assignments.findMany({
      include: {
        tasks: true,
        users: {
          select: { id: true, username: true, email: true },
        },
      },
    });
  }

  async findOne(id: number) {
    const taskAssignment = await this.prisma.task_assignments.findUnique({
      where: { id },
      include: {
        tasks: true,
        users: {
          select: { id: true, username: true, email: true },
        },
      },
    });
    if (!taskAssignment) {
      throw new NotFoundException(`Task assignment with ID ${id} not found`);
    }
    return taskAssignment;
  }

  async update(id: number, updateTaskAssignmentDto: UpdateTaskAssignmentDto) {
    return this.prisma.task_assignments.update({
      where: { id },
      data: updateTaskAssignmentDto,
    });
  }

  async remove(id: number) {
    return this.prisma.task_assignments.delete({
      where: { id },
    });
  }

  async findTaskByUserId(userId: number) {
    return this.prisma.task_assignments.findMany({
      where: { user_id: userId },
      select: { task_id: true },
    });
  }
}
