import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { WithdrawPackageUseCase } from './withdraw-package'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let sut: WithdrawPackageUseCase

// sut - System Under Test

describe('Withdraw Package', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()
    sut = new WithdrawPackageUseCase(inMemoryDeliverymanPackageRepository)
  })

  it('should be able to withdraw a Package', async () => {
    const user = makeDeliveryman(
      {
        cpf: '12345',
      },
      new UniqueEntityID('deliveryman-1'),
    )

    const newPackage = makeDeliverymanPackage({
      recipientId: new UniqueEntityID('recipient-1'),
      status: 'WAITING',
    })

    await inMemoryDeliverymanPackageRepository.create(newPackage)

    await sut.execute({
      packageId: newPackage.id.toString(),
      packageStatus: newPackage.status,
      deliverymanId: user.id.toString(),
    })

    expect(inMemoryDeliverymanPackageRepository.items[0].status).toEqual(
      'WITHDRAWN',
    )
    expect(inMemoryDeliverymanPackageRepository.items[0].deliverymanId).toEqual(
      user.id,
    )
    expect(
      inMemoryDeliverymanPackageRepository.items[0].withdrawAt,
    ).toBeTruthy()
  })

  it('should not be able to withdraw a package with other packageId', async () => {
    const user = makeDeliveryman(
      {
        cpf: '12345',
      },
      new UniqueEntityID('deliveryman-1'),
    )

    const newPackage = makeDeliverymanPackage({
      recipientId: new UniqueEntityID('recipient-1'),
      status: 'WAITING',
    })

    await inMemoryDeliverymanPackageRepository.create(newPackage)

    const result = await sut.execute({
      packageId: 'new-id',
      deliverymanId: user.id.toString(),
      packageStatus: 'WAITING',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to withdraw a package with other package status', async () => {
    const user = makeDeliveryman(
      {
        cpf: '12345',
      },
      new UniqueEntityID('deliveryman-1'),
    )

    const newPackage = makeDeliverymanPackage({
      recipientId: new UniqueEntityID('recipient-1'),
      status: 'WAITING',
    })

    await inMemoryDeliverymanPackageRepository.create(newPackage)

    const result = await sut.execute({
      packageId: newPackage.id.toString(),
      deliverymanId: user.id.toString(),
      packageStatus: 'STATUSTEST',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
