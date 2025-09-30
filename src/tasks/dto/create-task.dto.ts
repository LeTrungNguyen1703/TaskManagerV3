import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy groceries' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Milk, eggs, bread' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: TaskStatus, example: TaskStatus.PENDING })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ type: String, format: 'date-time', example: '2025-10-01T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  due_date?: Date;
}
