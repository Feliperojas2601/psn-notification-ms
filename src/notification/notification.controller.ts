import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateNotificationDto } from './DTO/createNotification.dto';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
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
