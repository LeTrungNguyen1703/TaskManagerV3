import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.tasks.create({ data: createTaskDto });
  }

  async findAll() {
    const testCache = await this.cache.get('test');
    if (testCache) {
      this.logger.log(`✅ Cache HIT: ${testCache}`);
    } else {
      this.logger.log('❌ Cache MISS - Setting new cache');
      await this.cache.set('test', 'This is a test cache value',6000000); // Thêm TTL
    }
    return this.prisma.tasks.findMany();
  }

  findOne(id: number) {}

  update(id: number, updateTaskDto: UpdateTaskDto) {}

  async remove(id: number) {
    const count = await this.prisma.tasks.deleteMany({
      where: { id },
    });

    if (count.count === 0) {
      throw new NotFoundException(`Task with ID ${id} does not exist.`);
    }
  }

  async changeTaskStatus(id: number, status: TaskStatus) {
    const task = await this.prisma.tasks.update({
      where: { id },
      data: { status },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} does not exist.`);
    }
    return {
      messages: `Task with ID ${id} has been updated to status ${status}`,
    };
  }
}
