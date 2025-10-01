import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskAssignmentsModule } from './task_assignments/task_assignments.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    TasksModule,
    TaskAssignmentsModule,
    AuthModule,
    CacheModule.register({})
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
