import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskAssignmentDto } from './dto/create-task_assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update-task_assignment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TaskAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskAssignmentDto: CreateTaskAssignmentDto) {
    return this.prisma.task_assignments.create({
      data: createTaskAssignmentDto,
    });
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
}
