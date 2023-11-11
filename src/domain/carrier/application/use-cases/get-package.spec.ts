import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { GetPackageUseCase } from './get-package'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let sut: GetPackageUseCase

// sut - System Under Test

describe('Get Package', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()
    sut = new GetPackageUseCase(inMemoryDeliverymanPackageRepository)
  })

  it('should be able to get deliveryman info', async () => {
    const user = makeDeliveryman({
      email: 'john@example.com',
      cpf: '12345',
    })

    const deliverymanPackage = makeDeliverymanPackage({
      recipientId: new UniqueEntityID('recipient-1'),
      deliverymanId: user.id,
    })

    inMemoryDeliverymanPackageRepository.items.push(deliverymanPackage)

    const result = await sut.execute({
      id: deliverymanPackage.id.toString(),
    })

    expect(result.value).toMatchObject({
      deliverymanPackage: expect.objectContaining({
        recipientId: new UniqueEntityID('recipient-1'),
        deliverymanId: user.id,
      }),
    })
  })
})
