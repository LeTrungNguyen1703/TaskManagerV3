import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    return this.prisma.tasks.create({
      data: createTaskDto,
    });
  }

  findAll() {}

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
}
