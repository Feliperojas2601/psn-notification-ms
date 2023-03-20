import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { ConfigurationService } from './configuration/configuration.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configurationService = app.get(ConfigurationService);

  const user = configurationService.get('RABBITMQ_USER');
  const password = configurationService.get('RABBITMQ_PASSWORD');
  const host = configurationService.get('RABBITMQ_HOST');
  const queueName = configurationService.get('RABBITMQ_QUEUE_NAME');

  const port = configurationService.get('PORT');

  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${password}@${host}`],
      queue: queueName,
      noAck: false,
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
