// import { Controller, Get, Post, Body, Param, Logger, Inject } from '@nestjs/common';
// import { RedisService } from './redis.service';
// import type { Cache } from 'cache-manager';
// import { CACHE_MANAGER } from '@nestjs/cache-manager';
//
// interface TaskNotification {
//   taskId: string;
//   userId: string;
//   action: 'created' | 'updated' | 'completed' | 'assigned';
//   timestamp: Date;
//   data?: any;
// }
//
// @Controller('redis-demo')
// export class RedisDemoController {
//   private readonly logger = new Logger(RedisDemoController.name);
//
//   constructor(
//     private readonly redisService: RedisService,
//     @Inject(CACHE_MANAGER) private cacheManager: Cache,
//   ) {
//     // Setup pub/sub listeners khi khởi tạo controller
//     this.setupSubscriptions();
//   }
//
//   private async setupSubscriptions() {
//     // Subscribe to task notifications
//     await this.redisService.subscribe('task-notifications', (message: TaskNotification) => {
//       this.logger.log(`Received task notification: ${JSON.stringify(message)}`);
//       // Xử lý notification ở đây (send to websocket, email, etc.)
//     });
//
//     // Subscribe to user activity với pattern matching
//     await this.redisService.psubscribe('user:*:activity', (message, channel) => {
//       this.logger.log(`User activity on channel ${channel}: ${JSON.stringify(message)}`);
//     });
//   }
//
//   // Cache operations examples
//   @Get('cache/set/:key/:value')
//   async setCache(@Param('key') key: string, @Param('value') value: string) {
//     // Sử dụng RedisService trực tiếp
//     await this.redisService.set(`demo:${key}`, { value, timestamp: new Date() }, 300); // TTL 5 minutes
//
//     // Hoặc sử dụng NestJS Cache Manager
//     await this.cacheManager.set(`cache:${key}`, value, 300000); // TTL 5 minutes in milliseconds
//
//     return { success: true, message: `Cached ${key} = ${value}` };
//   }
//
//   @Get('cache/get/:key')
//   async getCache(@Param('key') key: string) {
//     // Get từ RedisService
//     const redisValue = await this.redisService.get(`demo:${key}`);
//
//     // Get từ Cache Manager
//     const cacheValue = await this.cacheManager.get(`cache:${key}`);
//
//     return {
//       redisService: redisValue,
//       cacheManager: cacheValue,
//     };
//   }
//
//   @Get('cache/keys/:pattern')
//   async getKeys(@Param('pattern') pattern: string) {
//     const keys = await this.redisService.keys(pattern);
//     return { keys };
//   }
//
//   // Hash operations example
//   @Post('hash/user/:userId')
//   async setUserData(@Param('userId') userId: string, @Body() userData: any) {
//     const userKey = `user:${userId}`;
//
//     // Set multiple fields in hash
//     await this.redisService.hset(userKey, 'profile', userData);
//     await this.redisService.hset(userKey, 'lastLogin', new Date());
//     await this.redisService.hset(userKey, 'loginCount', (await this.redisService.hget(userKey, 'loginCount') || 0) + 1);
//
//     // Set expiration
//     await this.redisService.expire(userKey, 3600); // 1 hour
//
//     return { success: true, message: `User data set for ${userId}` };
//   }
//
//   @Get('hash/user/:userId')
//   async getUserData(@Param('userId') userId: string) {
//     const userKey = `user:${userId}`;
//     const userData = await this.redisService.hgetall(userKey);
//     const ttl = await this.redisService.ttl(userKey);
//
//     return {
//       userData,
//       expiresIn: ttl > 0 ? `${ttl} seconds` : 'No expiration',
//     };
//   }
//
//   // Pub/Sub operations examples
//   @Post('publish/task-notification')
//   async publishTaskNotification(@Body() notification: TaskNotification) {
//     const subscriberCount = await this.redisService.publish('task-notifications', {
//       ...notification,
//       timestamp: new Date(),
//     });
//
//     return {
//       success: true,
//       message: `Notification sent to ${subscriberCount} subscribers`,
//       notification
//     };
//   }
//
//   @Post('publish/user-activity/:userId')
//   async publishUserActivity(@Param('userId') userId: string, @Body() activity: any) {
//     const channel = `user:${userId}:activity`;
//     const subscriberCount = await this.redisService.publish(channel, {
//       userId,
//       activity,
//       timestamp: new Date(),
//     });
//
//     return {
//       success: true,
//       message: `Activity published to channel ${channel}`,
//       subscriberCount
//     };
//   }
//
//   // List operations example (for queues)
//   @Post('queue/task')
//   async addTaskToQueue(@Body() task: any) {
//     const queueLength = await this.redisService.rpush('task-queue', {
//       ...task,
//       id: Date.now().toString(),
//       createdAt: new Date(),
//     });
//
//     return {
//       success: true,
//       message: 'Task added to queue',
//       queueLength
//     };
//   }
//
//   @Get('queue/task/next')
//   async getNextTask() {
//     const task = await this.redisService.lpop('task-queue');
//     const remainingTasks = await this.redisService.llen('task-queue');
//
//     return {
//       task: task || null,
//       remainingInQueue: remainingTasks,
//     };
//   }
//
//   @Get('queue/task/peek')
//   async peekQueue() {
//     const tasks = await this.redisService.lrange('task-queue', 0, 4); // Get first 5 tasks
//     const totalTasks = await this.redisService.llen('task-queue');
//
//     return {
//       nextTasks: tasks,
//       totalInQueue: totalTasks,
//     };
//   }
//
//   // Set operations example (for unique collections)
//   @Post('tags/user/:userId')
//   async addUserTags(@Param('userId') userId: string, @Body() { tags }: { tags: string[] }) {
//     const userTagsKey = `user:${userId}:tags`;
//     const addedCount = await this.redisService.sadd(userTagsKey, ...tags);
//
//     return {
//       success: true,
//       message: `Added ${addedCount} new tags`,
//       totalTags: await this.redisService.scard(userTagsKey),
//     };
//   }
//
//   @Get('tags/user/:userId')
//   async getUserTags(@Param('userId') userId: string) {
//     const userTagsKey = `user:${userId}:tags`;
//     const tags = await this.redisService.smembers(userTagsKey);
//
//     return { tags };
//   }
//
//   // Statistics endpoint
//   @Get('stats')
//   async getRedisStats() {
//     const client = this.redisService.getClient();
//
//     // Get some basic Redis info
//     const info = await client.info('memory');
//     const dbsize = await client.dbsize();
//
//     return {
//       connectedClients: await client.client('LIST'),
//       databaseSize: dbsize,
//       memoryInfo: info.split('\r\n').filter(line => line.includes(':')).reduce((acc, line) => {
//         const [key, value] = line.split(':');
//         acc[key] = value;
//         return acc;
//       }, {}),
//     };
//   }
// }
