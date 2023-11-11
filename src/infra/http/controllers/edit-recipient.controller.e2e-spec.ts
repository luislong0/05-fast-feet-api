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

describe('Edit recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /recipients', async () => {
    const user = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '12345678',
      password: await hash('123456', 8),
      role: 'ADMIN',
    })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const newName = faker.person.fullName()

    const response = await request(app.getHttpServer())
      .put('/recipients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        cep: recipient.cep,
        city: recipient.city,
        district: recipient.district,
        id: recipient.id.toString(),
        name: newName,
        residenceNumber: recipient.residenceNumber,
        state: recipient.state,
        street: recipient.street,
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: newName,
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
