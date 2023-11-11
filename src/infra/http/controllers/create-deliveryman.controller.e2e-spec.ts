import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { hash } from 'bcryptjs'
import { DatabaseModule } from '@/infra/database/database.module'
import { JwtService } from '@nestjs/jwt'

describe('Create delivery (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /deliverymans', async () => {
    const user = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '12345678',
      password: await hash('123456', 8),
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/deliverymans')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '123456',
        cpf: '123456781',
        role: 'ADMIN',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'john.doe@gmail.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })

  test('[POST] /deliverymans', async () => {
    const user = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '123456789',
      password: await hash('1234567', 8),
      role: 'DELIVERYMAN',
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/deliverymans')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        password: '123456',
        cpf: '123456781',
        role: 'ADMIN',
      })

    expect(response.statusCode).toBe(403)
  })
})
