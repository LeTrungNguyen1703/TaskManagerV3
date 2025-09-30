import { PartialType } from '@nestjs/swagger';
import { CreateTaskAssignmentDto } from './create-task_assignment.dto';

export class UpdateTaskAssignmentDto extends PartialType(CreateTaskAssignmentDto) {}
