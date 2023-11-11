import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { DeletePackageUseCase } from './delete-package'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let sut: DeletePackageUseCase

// sut - System Under Test

describe('Delete Package', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()
    sut = new DeletePackageUseCase(inMemoryDeliverymanPackageRepository)
  })

  it('should be able to delete a package', async () => {
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

    expect(inMemoryDeliverymanPackageRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a package from another id', async () => {
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

    const result = await sut.execute({
      packageId: 'new-package-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
