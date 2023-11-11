import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CacheModule } from '../cache/cache.module'
import { DeliverymanRepository } from '@/domain/carrier/application/repositories/deliveryman-repository'
import { PrismaDeliverymanRepository } from './prisma/repositories/prisma-deliveryman-repository'
import { DeliverymanPackageRepository } from '@/domain/carrier/application/repositories/deliveryman-package-repository'
import { PrismaDeliverymanPackageRepository } from './prisma/repositories/prisma-deliveryman-package-repository'
import { RecipientRepository } from '@/domain/carrier/application/repositories/recipient-repository'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'
import { UploadRepository } from '@/domain/carrier/application/repositories/upload-repository'
import { PrismaUploadRepository } from './prisma/repositories/prisma-upload-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: DeliverymanRepository,
      useClass: PrismaDeliverymanRepository,
    },
    {
      provide: DeliverymanPackageRepository,
      useClass: PrismaDeliverymanPackageRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: UploadRepository,
      useClass: PrismaUploadRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    DeliverymanRepository,
    DeliverymanPackageRepository,
    RecipientRepository,
    UploadRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
