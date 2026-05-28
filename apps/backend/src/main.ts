import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:5000',
  ];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const rateLimitWindow = Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
  const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 1000);
  const requestCounters = new Map<string, { count: number; windowStart: number }>();

  app.use((req, res, next) => {
    const forwarded = req.headers['x-forwarded-for']?.toString().split(',')[0].trim();
    const key = forwarded || req.ip || 'global';
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
