import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { DeliverymanPackageFactory } from 'test/factories/make-deliveryman-package'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'
import { hash } from 'bcryptjs'

describe('On answer comment create (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let packageFactory: DeliverymanPackageFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliverymanFactory,
        RecipientFactory,
        DeliverymanPackageFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    packageFactory = moduleRef.get(DeliverymanPackageFactory)
    jwt = moduleRef.get(JwtService)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when answer comment is created', async () => {
    const user = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '12345678',
      password: await hash('123456', 8),
    })

    const recipient = await recipientFactory.makePrismaRecipient()
    console.log('recipientId' + recipient.id)

    const newPackage = await packageFactory.makePrismaDeliverymanPackage({
      deliverymanId: user.id,
      recipientId: recipient.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await request(app.getHttpServer())
      .put(`/packages/post/${newPackage.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      console.log(notificationOnDatabase)

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
