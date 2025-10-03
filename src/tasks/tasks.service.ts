import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.prisma.tasks.create({ data: createTaskDto });

    // Clear cache khi có task mới
    await this.cache.del('tasks:all');
    this.logger.log('🗑️ Cleared tasks cache after creating new task');

    return task;
  }

  async findAll() {
    return this.prisma.tasks.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.tasks.findUnique({ where: { id } });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prisma.tasks.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: number) {
    const count = await this.prisma.tasks.deleteMany({
      where: { id },
    });

    if (count.count === 0) {
      throw new NotFoundException(`Task with ID ${id} does not exist.`);
    }

    // Clear cache khi xóa task
    await this.cache.del('tasks:all');
    await this.cache.del(`/tasks/${id}`);
    this.logger.log('🗑️ Cleared tasks cache after deleting task');
  }

  async changeTaskStatus(id: number, status: TaskStatus) {
    const task = await this.prisma.tasks.update({
      where: { id },
      data: { status },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} does not exist.`);
    }

    // Clear cache khi update task status
    await this.cache.del('tasks:all');
    this.logger.log('🗑️ Cleared tasks cache after updating task status');

    return {
      messages: `Task with ID ${id} has been updated to status ${status}`,
    };
  }
}
