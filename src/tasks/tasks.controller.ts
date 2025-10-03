import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Logger,
  Inject,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  Cache,
  CacheKey,
} from '@nestjs/cache-manager';
import { AuthGuard } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

export interface TaskInterface {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: Date | null;
  created_at: Date | null;
  updated_at: Date | null;
}

@UseInterceptors(CacheInterceptor)
@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(
    private readonly tasksService: TasksService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async create(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<{ task: TaskInterface }> {
    await this.cache.del('tasks');
    await this.cache.del('tasks/');
    return { task: await this.tasksService.create(createTaskDto) };
  }

  @Get()
  @CacheKey('tasks:all')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    this.logger.log(`User ${req.user.username} is retrieving all tasks.`);
    return this.tasksService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
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

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Change the status of a task' })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid id or status.' })
  @ApiParam({
    name: 'status',
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    description:
      'New status for the task. Allowed values: PENDING, IN_PROGRESS, COMPLETED, CANCELLED.',
  })
  async changeTaskStatus(
    @Param('id') id: number,
    @Param('status') status: TaskStatus,
  ): Promise<{ messages: string }> {
    return this.tasksService.changeTaskStatus(id, status);
  }
}
