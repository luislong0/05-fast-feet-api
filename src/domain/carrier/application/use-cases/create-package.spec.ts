import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { CreatePackageUseCase } from './create-package'
import { faker } from '@faker-js/faker'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let sut: CreatePackageUseCase

// sut - System Under Test

describe('Create Package', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()

    sut = new CreatePackageUseCase(inMemoryDeliverymanPackageRepository)
  })

  it('should be able to create a package', async () => {
    const deliveryMan = makeDeliveryman()

    const result = await sut.execute({
      postAt: new Date(),
      recipientId: new UniqueEntityID('recipient-2'),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      status: 'packing',
      title: faker.lorem.slug(),
      description: faker.lorem.paragraph(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanPackageRepository.items[0].status).toEqual(
      'packing',
    )
  })
})
