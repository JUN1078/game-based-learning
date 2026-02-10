import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from './app.module';

const server = express();
let cachedApp: any;

async function createNestApp() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : ['http://localhost:5173'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api');

  await app.init();
  cachedApp = app;
  return app;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  await createNestApp();
  server(req, res);
}

// Local development server
if (!process.env.VERCEL) {
  (async () => {
    await createNestApp();
    const port = process.env.PORT || 3000;
    cachedApp.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`API available at http://localhost:${port}/api`);
    });
  })();
}
