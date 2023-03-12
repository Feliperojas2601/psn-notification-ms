import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop({
    required: [true, 'Notification actor id is required'],
  })
  actorId: number;

  @Prop({
    required: [true, 'Notification notifier id are required'],
  })
  notifierId: number;

  @Prop({
    required: [true, 'Notification title is required'],
  })
  title: string;

  @Prop({
    required: [true, 'Notification content is required'],
  })
  content: string;

  @Prop({
    required: [true, 'Notification type is required'],
  })
  type: string;

  @Prop({
    required: [true, 'Notification date is required'],
    default: Date.now,
  })
  createDate: Date;

  @Prop()
  updateDate: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
