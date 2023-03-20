import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreateNotificationDto } from './DTO/createNotification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject('NOTIFICATION_RMQ_SERVICE')
    private notificationRMQService: ClientProxy,
  ) {}

  @Post()
  async createNotification(
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    const notification = await this.notificationService.createNotification(
      createNotificationDto,
    );

    const {
      actorId,
      notifierId,
      type,
      title,
      content,
      createDate,
      updateDate,
    } = notification;

    const createNotificationWsDto = {
      actorId,
      notifierId,
      type,
      title,
      content,
      createDate,
      updateDate,
    };

    try {
      const response = await this.notificationRMQService.emit(
        'CREATE_NOTIFICATION',
        createNotificationWsDto,
      );
      console.log('Response from receiver micro:', response);
    } catch (error) {
      throw new RpcException(error);
    }
    return notification;
  }
}
