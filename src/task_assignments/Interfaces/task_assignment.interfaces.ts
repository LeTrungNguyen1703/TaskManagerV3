import { TaskInterface } from '../../tasks/tasks.controller';

export interface TaskAssignmentInterface {
  id: number;
  task_id: number;
  user_id: number;
  assigned_at: Date | null; // ISO date string
}


export interface TaskAssignmentFindInterface {
  id: number;
  tasks: TaskInterface;
  users: { id: number; username: string; email: string}
  assigned_at: Date | null;
}