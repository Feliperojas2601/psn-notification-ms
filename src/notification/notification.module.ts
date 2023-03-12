import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';

import { NotificationService } from './notification.service';
import { NotificationSocketGateway } from './notification.gateway';

import { NotificationController } from './notification.controller';

import { Notification, NotificationSchema } from './entity/notification.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationSocketGateway],
})
export class NotificationModule {}
