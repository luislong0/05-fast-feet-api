import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { EditPackageUseCase } from './edit-package'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { faker } from '@faker-js/faker'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let sut: EditPackageUseCase

// sut - System Under Test

describe('Edit Package', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()
    sut = new EditPackageUseCase(inMemoryDeliverymanPackageRepository)
  })

  it('should be able to edit a Package', async () => {
    const user = makeDeliveryman(
      {
        cpf: '12345',
      },
      new UniqueEntityID('deliveryman-1'),
    )

    const newPackage = makeDeliverymanPackage({
      recipientId: new UniqueEntityID('recipient-1'),
      deliverymanId: user.id,
    })

    await inMemoryDeliverymanPackageRepository.create(newPackage)

    const newLatitude = faker.location.latitude()
    const newLongitude = faker.location.longitude()

    await sut.execute({
      id: newPackage.id.toString(),
      latitude: newLatitude,
      longitude: newLongitude,
      title: 'New title',
      description: 'New description',
    })

    expect(inMemoryDeliverymanPackageRepository.items[0]).toMatchObject({
      latitude: newLatitude,
      longitude: newLongitude,
      title: 'New title',
      description: 'New description',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const user = makeDeliveryman(
      {
        cpf: '12345',
      },
      new UniqueEntityID('deliveryman-1'),
    )

    const newPackage = makeDeliverymanPackage(
      {
        recipientId: new UniqueEntityID('recipient-1'),
        deliverymanId: user.id,
      },
      new UniqueEntityID('package-1'),
    )

    await inMemoryDeliverymanPackageRepository.create(newPackage)

    const newLatitude = faker.location.latitude()
    const newLongitude = faker.location.longitude()

    const result = await sut.execute({
      id: 'new id',
      latitude: newLatitude,
      longitude: newLongitude,
      title: 'New title',
      description: 'New description',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
