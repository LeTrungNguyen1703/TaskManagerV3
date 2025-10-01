import { Injectable } from '@nestjs/common';
import { CreateTaskAssignmentDto } from './dto/create-task_assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update-task_assignment.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TaskAssignmentInterface } from './task_assignments.controller';

@Injectable()
export class TaskAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskAssignmentDto: CreateTaskAssignmentDto) {
    return this.prisma.task_assignments.create({
      data: createTaskAssignmentDto,
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        tasks: true
      },
    });
  }

  async findAll() {
    return this.prisma.task_assignments.findMany();
  }

  async findOne(id: number) {
    return this.prisma.task_assignments.findUnique({
      where: { id },
    });
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
