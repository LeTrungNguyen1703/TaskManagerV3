import * as process from 'node:process';

export const configTaskApp = () => {
  // Parse Redis URL if provided
  const redisHost = process.env.REDIS_HOST || 'localhost';
  let parsedHost = 'localhost';
  let parsedPort = 6379;

  // If REDIS_HOST is a URL like redis://redis:6379, parse it
  if (redisHost.startsWith('redis://')) {
    try {
      const url = new URL(redisHost);
      parsedHost = url.hostname;
      parsedPort = parseInt(url.port, 10) || 6379;
      console.log(`📍 Parsed Redis URL: ${redisHost} -> host: ${parsedHost}, port: ${parsedPort}`);
    } catch (error) {
      console.warn('Failed to parse REDIS_HOST URL, using defaults');
    }
  } else {
    parsedHost = redisHost;
    console.log(`📍 Using Redis host directly: ${parsedHost}`);
  }

  const finalConfig = {
    database: {
      port: process.env.PORT ?? 3000,
    },
    redis: {
      host: parsedHost,
      port: parseInt(process.env.REDIS_PORT!, 10) || parsedPort,
      password: process.env.REDIS_PASSWORD || undefined,
      username: process.env.REDIS_USERNAME || undefined,
      db: parseInt(process.env.REDIS_DB!, 10) || 0,
      retryDelayOnFailover: 100,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
    },
  };

  console.log(`🔧 Final Redis config: ${JSON.stringify(finalConfig.redis, null, 2)}`);
  return finalConfig;
};
