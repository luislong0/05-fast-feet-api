import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { ReturnPackageUseCase } from './return-package'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let sut: ReturnPackageUseCase

// sut - System Under Test

describe('Return Package', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()
    sut = new ReturnPackageUseCase(inMemoryDeliverymanPackageRepository)
  })

  it('should be able to return a Package', async () => {
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

    await sut.execute({
      packageId: newPackage.id.toString(),
    })

    expect(inMemoryDeliverymanPackageRepository.items[0].status).toEqual(
      'RETURNED',
    )
    expect(inMemoryDeliverymanPackageRepository.items[0].returnAt).toBeTruthy()
  })

  it('should not be able to return a package that not exists', async () => {
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

    const result = await sut.execute({
      packageId: 'new-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
