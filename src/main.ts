import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      // Local development (다양한 포트)
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      // Production IPs
      'http://3.36.184.159',
      'https://3.36.184.159',
      'http://43.200.241.26',
      'https://43.200.241.26',
      'http://43.201.126.232',
      'https://43.201.126.232',
      // Production domains
      'http://total-callbot.cloud',
      'https://total-callbot.cloud',
      'http://www.total-callbot.cloud',
      'https://www.total-callbot.cloud',
      'http://realtime-englsih-trainer.co.kr',
      'https://realtime-englsih-trainer.co.kr',
      'http://www.realtime-englsih-trainer.co.kr',
      'https://www.realtime-englsih-trainer.co.kr',
      'http://api.realtime-englsih-trainer.co.kr',
      'https://api.realtime-englsih-trainer.co.kr',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Length', 'Content-Type'],
    maxAge: 3600,
  });

  await app.listen(process.env.PORT ?? 8090);
}
bootstrap();
