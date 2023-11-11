import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { hash } from 'bcryptjs'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { RecipientFactory } from 'test/factories/make-recipient'
import { DeliverymanPackageFactory } from 'test/factories/make-deliveryman-package'
import { faker } from '@faker-js/faker'

describe('Edit package (E2E)', () => {
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

    await app.init()
  })

  test('[PUT] /packages', async () => {
    const user = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '12345678',
      password: await hash('123456', 8),
      role: 'ADMIN',
    })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const newPackage = await packageFactory.makePrismaDeliverymanPackage({
      deliverymanId: user.id,
      recipientId: recipient.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const newLatitude = faker.location.latitude()
    const newLongitude = faker.location.longitude()

    const response = await request(app.getHttpServer())
      .put('/packages')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'new title',
        description: 'new description',
        id: newPackage.id.toString(),
        latitude: newLatitude,
        longitude: newLongitude,
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.package.findFirst({
      where: {
        title: 'new title',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
