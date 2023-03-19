import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    const notification = this.notificationService.createNotification(
      createNotificationDto,
    );
    this.notificationRMQService.send(
      {
        cmd: 'create-notification',
      },
      notification,
    );
    return notification;
  }

  @Get('/user/:userId')
  findOne(
    @Param('userId') userId: number,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const paginationDto = { limit, offset };
    return this.notificationService.getNotificationsByUser(
      userId,
      paginationDto,
    );
  }
}
