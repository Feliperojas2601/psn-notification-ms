import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { NotificationService } from './notification.service';
import { NotificationSocketGateway } from './notification.gateway';
import { ConfigurationService } from 'src/configuration/configuration.service';

import { NotificationController } from './notification.controller';

import { Notification, NotificationSchema } from './entity/notification.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
    ConfigurationModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    //NotificationSocketGateway,
    {
      provide: 'NOTIFICATION_RMQ_SERVICE',
      useFactory: (configurationService: ConfigurationService) => {
        const user = configurationService.get('RABBITMQ_USER');
        const password = configurationService.get('RABBITMQ_PASSWORD');
        const host = configurationService.get('RABBITMQ_HOST');
        const queueName = configurationService.get('RABBITMQ_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigurationService],
    },
  ],
})
export class NotificationModule {}
