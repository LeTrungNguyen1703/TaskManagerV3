import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskAssignmentsService } from './task_assignments.service';
import { CreateTaskAssignmentDto } from './dto/create-task_assignment.dto';
import { UpdateTaskAssignmentDto } from './dto/update-task_assignment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  TaskAssignmentFindInterface,
  TaskAssignmentInterface, TaskIdInterface,
} from './Interfaces/task_assignment.interfaces';
import { AuthGuard } from '@nestjs/passport';
import { TaskInterface } from '../tasks/tasks.controller';

@ApiTags('task-assignments')
@Controller('task-assignments')
export class TaskAssignmentsController {
  constructor(
    private readonly taskAssignmentsService: TaskAssignmentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task assignment' })
  @ApiResponse({
    status: 201,
    description: 'Task assignment created successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(
    @Body() createTaskAssignmentDto: CreateTaskAssignmentDto,
  ): Promise<TaskAssignmentInterface> {
    return this.taskAssignmentsService.create(createTaskAssignmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all task assignments' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'List of task assignments returned.',
  })
  async findAll(): Promise<TaskAssignmentFindInterface[]> {
    return this.taskAssignmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task assignment by ID' })
  @ApiResponse({ status: 200, description: 'Task assignment returned.' })
  @ApiResponse({ status: 404, description: 'Task assignment not found.' })
  async findOne(@Param('id') id: string): Promise<TaskAssignmentFindInterface> {
    return this.taskAssignmentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task assignment' })
  @ApiResponse({
    status: 200,
    description: 'Task assignment updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(
    @Param('id') id: string,
    @Body() updateTaskAssignmentDto: UpdateTaskAssignmentDto,
  ) {
    return this.taskAssignmentsService.update(+id, updateTaskAssignmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task assignment' })
  @ApiResponse({
    status: 200,
    description: 'Task assignment deleted successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid id.' })
  remove(@Param('id') id: string) {
    return this.taskAssignmentsService.remove(+id);
  }

  @Get('user/:userId/tasks')
  @ApiOperation({ summary: 'Get all tasks assigned to a specific user' })
  @ApiResponse({
    status: 200,
    description: 'List of tasks assigned to the user returned.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findTasksByUserId(
    @Param('userId') userId: string,
  ): Promise<TaskIdInterface[]> {
    return this.taskAssignmentsService.findTaskByUserId(+userId);
  }
}
