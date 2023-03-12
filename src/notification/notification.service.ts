import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './entity/notification.entity';

import { CreateNotificationDto } from './DTO/createNotification.dto';
import { PaginationDto } from 'src/common/DTO/pagination.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}
  async createNotification(createNotificationDto: CreateNotificationDto) {
    try {
      const { actorName, type } = createNotificationDto;
      const title = type;
      const content = this.handleMessageContent(type, actorName);
      const createNotification = {
        ...createNotificationDto,
        title,
        content,
      };
      if (content == 'Invalid resource type') {
        throw new BadRequestException('Invalid resource type of notification');
      }
      const notification = await this.notificationModel.create(
        createNotification,
      );
      return notification;
    } catch (error) {
      this.handleException(error);
    }
  }

  async getNotificationsByUser(
    userId: number,
    paginationDto: PaginationDto,
  ): Promise<Notification[]> {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const notifications = await this.notificationModel
        .find({
          notifierId: userId,
        })
        .skip(offset)
        .limit(limit);
      return notifications;
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleMessageContent(type: string, userName: string): string {
    switch (type) {
      case 'FRIEND_REQUEST':
        return `${userName} has sended a friend request to you.`;
      case 'FRIEND_CONFIRMATION':
        return `${userName} has accepted your friend request.`;
      case 'EVENT_ASSISTANT':
        return `${userName} is going to assist to your event.`;
      default:
        return 'Invalid resource type';
    }
  }

  private handleException(error: any): void {
    console.log(error);
    if (error.response.error == 'Bad Request') {
      throw new BadRequestException(error.response.message);
    }
    throw new InternalServerErrorException(
      `Unknown error, please contact server Admins`,
    );
  }
}
