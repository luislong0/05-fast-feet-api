import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { hash } from 'bcryptjs'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { RecipientFactory } from 'test/factories/make-recipient'
import { DeliverymanPackageFactory } from 'test/factories/make-deliveryman-package'

describe('Get package (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
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

    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    packageFactory = moduleRef.get(DeliverymanPackageFactory)

    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /packages/:id', async () => {
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

    const response = await request(app.getHttpServer())
      .get(`/packages/${newPackage.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      package: expect.objectContaining({
        id: newPackage.id.toString(),
      }),
    })
  })
})
