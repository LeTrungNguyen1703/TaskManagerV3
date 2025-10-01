import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskAssignmentsService } from './task_assignments.service';
import { CreateTaskAssignmentDto } from './dto/create-task_assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update-task_assignment.dto';
import { TaskInterface } from '../tasks/tasks.controller';

export interface TaskAssignmentInterface {
  id: number;
  tasks: TaskInterface;
  users: { id: number; username: string; email: string };
  assigned_at: Date | null; // ISO date string
}

@Controller('task-assignments')
export class TaskAssignmentsController {
  constructor(
    private readonly taskAssignmentsService: TaskAssignmentsService,
  ) {}

  @Post()
  async create(
    @Body() createTaskAssignmentDto: CreateTaskAssignmentDto,
  ): Promise<TaskAssignmentInterface> {
    return this.taskAssignmentsService.create(createTaskAssignmentDto);
  }

  @Get()
  findAll() {
    return this.taskAssignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskAssignmentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskAssignmentDto: UpdateTaskAssignmentDto,
  ) {
    return this.taskAssignmentsService.update(+id, updateTaskAssignmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskAssignmentsService.remove(+id);
  }
}
