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
import { faker } from '@faker-js/faker'

describe('Create package (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliverymanFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /packages', async () => {
    const user = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '12345678',
      password: await hash('123456', 8),
      role: 'ADMIN',
    })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/packages')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'Test Description',
        latitude: faker.location.latitude(),
        longitude: faker.location.longitude(),
        postAt: new Date(),
        recipientId: recipient.id.toString(),
        status: 'POSTED',
        title: 'Test Title',
      })

    expect(response.statusCode).toBe(201)

    const packageOnDatabase = await prisma.package.findFirst({
      where: {
        title: 'Test Title',
      },
    })

    expect(packageOnDatabase).toBeTruthy()
  })
})
