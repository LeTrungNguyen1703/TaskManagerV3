import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from '@prisma/client';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export interface TaskInterface {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<{ task: TaskInterface }> {
    return { task: await this.tasksService.create(createTaskDto) };
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 201, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid id.' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    await this.tasksService.remove(+id);
    return { message: `Task with ID ${id} has been deleted.` };
  }
}
