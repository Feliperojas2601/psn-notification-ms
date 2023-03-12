import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
//import * as socketio_jwt from 'socketio-jwt';
import { Server, Socket } from 'socket.io';

import { Notification } from './entity/notification.entity';

import { CreateNotificationDto } from './DTO/createNotification.dto';

import { ConfigurationService } from 'src/configuration/configuration.service';
import { NotificationService } from './notification.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'notification',
  secure: true,
})
export class NotificationSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private configurationService: ConfigurationService,
    private notificationService: NotificationService,
  ) {}
  afterInit() {
    console.log('Init');
  }

  /*afterInit(): void {
    this.server.use(
      socketio_jwt.authorize({
        secret: this.config_service.get<string>('JWT_SECRET'),
        handshake: true,
      }),
    );
  }*/

  handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('CREATE_NOTIFICATION')
  public async handleCreateMessage(
    client: Socket,
    createNotificationDto: CreateNotificationDto,
  ) {
    try {
      const notification: Notification =
        await this.notificationService.createNotification(
          createNotificationDto,
        );
      this.server
        .to(`roomId${notification.notifierId}`)
        .emit('CREATED_NOTIFICATION', notification);
    } catch (e) {
      console.error(e.stack);
    }
  }

  @SubscribeMessage('JOIN_CONVERSATION')
  public handleJoinConversation(client: Socket, userId: any) {
    const userIdNumber = userId.userId;
    const roomId = `roomId${userIdNumber}`;
    client.join(roomId);
  }

  @SubscribeMessage('LEAVE_CONVERSATION')
  public handleLeaveConversation(client: Socket, userId: any) {
    const userIdNumber = userId.userId;
    const roomId = `roomId${userIdNumber}`;
    client.leave(roomId);
  }
}
