import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigurationService } from './configuration/configuration.service';

@Module({
  imports: [
    NotificationModule,
    ConfigurationModule,
    MongooseModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) =>
        configurationService.getMongoConfig(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
