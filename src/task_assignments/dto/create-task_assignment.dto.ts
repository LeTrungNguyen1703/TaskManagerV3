import { IsInt, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskAssignmentDto {
  @ApiProperty({ description: 'ID of the task', example: 1 })
  @IsInt()
  task_id: number;

  @ApiProperty({ description: 'ID of the user', example: 2 })
  @IsInt()
  user_id: number;

  @ApiPropertyOptional({ description: 'Assignment timestamp', type: String, format: 'date-time' })
  @IsOptional()
  @IsDateString()
  assigned_at?: string;
}
