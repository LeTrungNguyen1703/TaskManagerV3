import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskAssignmentsModule } from './task_assignments/task_assignments.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConstants } from './auth/constants';
import { configTaskApp } from '../config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    TasksModule,
    TaskAssignmentsModule,
    AuthModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get('REDIS_HOST') || 'localhost',
            port: configService.get('REDIS_PORT') || 6379,
          },
          password: configService.get('REDIS_PASSWORD') || undefined,
        });

        return {
          store,
          ttl: 600000, // 10 minutes in milliseconds
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [jwtConstants, configTaskApp],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
