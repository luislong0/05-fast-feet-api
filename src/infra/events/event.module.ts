import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnPackageUpdated } from '@/domain/notification/application/subscribers/on-package-updated-event'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [OnPackageUpdated, SendNotificationUseCase],
})
export class EventsModule {}
