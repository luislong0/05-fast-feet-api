import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { PostPackageUseCase } from './post-package'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let sut: PostPackageUseCase

// sut - System Under Test

describe('Post Package', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()
    sut = new PostPackageUseCase(inMemoryDeliverymanPackageRepository)
  })

  it('should be able to post a Package', async () => {
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
      deliverymanId: user.id.toString(),
    })

    expect(inMemoryDeliverymanPackageRepository.items[0].status).toEqual(
      'WAITING',
    )
    expect(inMemoryDeliverymanPackageRepository.items[0].postAt).toBeTruthy()
  })

  it('should not be able to post a package that not exists', async () => {
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
      deliverymanId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
