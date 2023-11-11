import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { RecipientFactory } from 'test/factories/make-recipient'
import { hash } from 'bcryptjs'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { DeliverymanPackageFactory } from 'test/factories/make-deliveryman-package'

describe('Get recipient (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliverymanFactory
  let packageFactory: DeliverymanPackageFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        RecipientFactory,
        DeliverymanFactory,
        DeliverymanPackageFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    packageFactory = moduleRef.get(DeliverymanPackageFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /recipients/:cpf', async () => {
    const user = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '12345678',
      password: await hash('123456', 8),
      role: 'ADMIN',
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    await packageFactory.makePrismaDeliverymanPackage({
      deliverymanId: user.id,
      recipientId: recipient.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get(`/recipients/${recipient.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      recipient: expect.objectContaining({
        recipientId: recipient.id.toString(),
      }),
    })
  })
})
