import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'
import { FetchNearbyPackagesUseCase } from './fetch-nearby-packages'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let sut: FetchNearbyPackagesUseCase

// sut - System Under Test

describe('Fetch nearby packages', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()
    sut = new FetchNearbyPackagesUseCase(inMemoryDeliverymanPackageRepository)
  })

  it('should be able to fetch nearby packages', async () => {
    const user = makeDeliveryman({
      email: 'john@example.com',
      cpf: '12345',
    })

    await inMemoryDeliverymanPackageRepository.create(
      makeDeliverymanPackage({
        recipientId: new UniqueEntityID('recipient-1'),
        deliverymanId: user.id,
        latitude: -27.2092052,
        longitude: -49.6401091,
      }),
    )

    await inMemoryDeliverymanPackageRepository.create(
      makeDeliverymanPackage({
        recipientId: new UniqueEntityID('recipient-2'),
        deliverymanId: user.id,
        latitude: -27.0610928,
        longitude: -49.5229501,
      }),
    )

    const result = await sut.execute({
      deliverymanId: user.id.toString(),
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
      page: 1,
    })

    expect(result.value?.packages).toHaveLength(1)
  })

  it('should not be able to fetch nearby packages', async () => {
    const user = makeDeliveryman({
      email: 'john@example.com',
      cpf: '12345',
    })

    await inMemoryDeliverymanPackageRepository.create(
      makeDeliverymanPackage({
        recipientId: new UniqueEntityID('recipient-1'),
        deliverymanId: user.id,
        latitude: -27.2092052,
        longitude: -49.6401091,
      }),
    )

    await inMemoryDeliverymanPackageRepository.create(
      makeDeliverymanPackage({
        recipientId: new UniqueEntityID('recipient-2'),
        deliverymanId: user.id,
        latitude: -27.0610928,
        longitude: -49.5229501,
      }),
    )

    const result = await sut.execute({
      deliverymanId: 'testDeliveryman',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
      page: 1,
    })

    expect(result.value?.packages).toHaveLength(0)
  })
})
