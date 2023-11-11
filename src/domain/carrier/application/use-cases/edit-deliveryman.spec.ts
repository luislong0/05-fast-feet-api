import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { EditDeliverymanUseCase } from './edit-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: EditDeliverymanUseCase

// sut - System Under Test

describe('Edit Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new EditDeliverymanUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to edit a deliveryman', async () => {
    const newDeliveryman = makeDeliveryman(
      {
        cpf: '12345',
      },
      new UniqueEntityID('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(newDeliveryman)

    await sut.execute({
      cpf: newDeliveryman.cpf,
      deliverymanId: newDeliveryman.id.toString(),
      email: 'newEmail@gmail.com',
      name: 'new name',
    })

    expect(inMemoryDeliverymanRepository.items[0]).toMatchObject({
      email: 'newEmail@gmail.com',
      name: 'new name',
    })
  })

  it('should not be able to edit a answer from another user', async () => {
    const newDeliveryman = makeDeliveryman(
      {
        cpf: '12345',
      },
      new UniqueEntityID('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(newDeliveryman)

    const result = await sut.execute({
      cpf: newDeliveryman.cpf,
      deliverymanId: 'testeid',
      email: 'newEmail@gmail.com',
      name: 'new name',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
