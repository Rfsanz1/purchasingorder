import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const rateLimitWindow = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
  const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 120);
  const requestCounters = new Map<string, { count: number; windowStart: number }>();

  app.use((req, res, next) => {
    const key = req.ip || req.headers['x-forwarded-for']?.toString() || 'global';
    const now = Date.now();
    const counter = requestCounters.get(key);

    if (!counter || now - counter.windowStart > rateLimitWindow) {
      requestCounters.set(key, { count: 1, windowStart: now });
    } else {
      counter.count += 1;
      requestCounters.set(key, counter);
    }

    if (requestCounters.get(key)?.count! > rateLimitMax) {
      res.status(429).json({ message: 'Too many requests. Please try again later.' });
      return;
    }

    res.setHeader('X-Powered-By', 'ERP Modern Backend');
    next();
  });

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000);
  console.log(`Modern backend running on http://localhost:${process.env.PORT ?? 4000}`);
}

bootstrap();
