import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'
import { FetchPackagesByDeliverymanIdUseCase } from './fetch-packages-by-deliverymanId'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let sut: FetchPackagesByDeliverymanIdUseCase

// sut - System Under Test

describe('Fetch packages by Deliveryman Id', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()
    sut = new FetchPackagesByDeliverymanIdUseCase(
      inMemoryDeliverymanPackageRepository,
    )
  })

  it('should be able to fetch packages with deliverymanId', async () => {
    const user = makeDeliveryman({
      email: 'john@example.com',
      cpf: '12345',
    })

    await inMemoryDeliverymanPackageRepository.create(
      makeDeliverymanPackage({
        recipientId: new UniqueEntityID('recipient-1'),
        deliverymanId: user.id,
      }),
    )

    await inMemoryDeliverymanPackageRepository.create(
      makeDeliverymanPackage({
        recipientId: new UniqueEntityID('recipient-2'),
        deliverymanId: user.id,
      }),
    )

    await inMemoryDeliverymanPackageRepository.create(
      makeDeliverymanPackage({
        recipientId: new UniqueEntityID('recipient-3'),
        deliverymanId: user.id,
      }),
    )

    const result = await sut.execute({
      deliverymanId: user.id.toString(),
      page: 1,
    })

    expect(result.value?.packages).toEqual([
      expect.objectContaining({
        recipientId: {
          value: 'recipient-1',
        },
      }),
      expect.objectContaining({
        recipientId: {
          value: 'recipient-2',
        },
      }),
      expect.objectContaining({
        recipientId: {
          value: 'recipient-3',
        },
      }),
    ])
  })
})
