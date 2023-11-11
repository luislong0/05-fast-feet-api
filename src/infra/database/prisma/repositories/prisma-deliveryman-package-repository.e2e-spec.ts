import { DeliverymanPackageRepository } from '@/domain/carrier/application/repositories/deliveryman-package-repository'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { DeliverymanPackageFactory } from 'test/factories/make-deliveryman-package'
import { RecipientFactory } from 'test/factories/make-recipient'
import { hash } from 'bcryptjs'
import { PrismaPackageMapper } from '../mappers/prisma-package-mapper'

describe('Prisma Questions Repository (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let packageFactory: DeliverymanPackageFactory
  let cacheRepository: CacheRepository
  let packageRepository: DeliverymanPackageRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        DeliverymanFactory,
        RecipientFactory,
        DeliverymanPackageFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    packageFactory = moduleRef.get(DeliverymanPackageFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    packageRepository = moduleRef.get(DeliverymanPackageRepository)

    await app.init()
  })

  it('should cache question details', async () => {
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

    const questionDetails = await packageRepository.findManyByDeliverymanId(
      user.id.toString(),
      {
        page: 1,
      },
    )

    const prismaPackageDetails = PrismaPackageMapper.toPrisma(newPackage)

    const cached = await cacheRepository.get(
      `question:${user.id.toString()}:packages`,
    )

    console.log(cached)
    console.log(newPackage)

    expect(cached).toBeTruthy()
  })

  it('should return cached question details on subsequent calls', async () => {
    const user = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '123456789',
      password: await hash('123456', 8),
      role: 'ADMIN',
    })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const newPackage = await packageFactory.makePrismaDeliverymanPackage({
      deliverymanId: user.id,
      recipientId: recipient.id,
    })

    await cacheRepository.set(
      `question:${user.id.toString()}:packages`,
      JSON.stringify({ empty: true }),
    )

    const questionDetails = await packageRepository.findManyByDeliverymanId(
      user.id.toString(),
      {
        page: 1,
      },
    )

    expect(questionDetails).toEqual({ empty: true })
  })

  it('should reset question details cache when saving the question', async () => {
    const user = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '1234567810',
      password: await hash('123456', 8),
      role: 'ADMIN',
    })

    const recipient = await recipientFactory.makePrismaRecipient({})

    const newPackage = await packageFactory.makePrismaDeliverymanPackage({
      deliverymanId: user.id,
      recipientId: recipient.id,
    })

    await cacheRepository.set(
      `question:${user.id.toString()}:packages`,
      JSON.stringify({ empty: true }),
    )

    await packageRepository.save(newPackage)

    const cached = await cacheRepository.get(
      `question:${user.id.toString()}:packages`,
    )

    expect(cached).toBeNull()
  })
})
