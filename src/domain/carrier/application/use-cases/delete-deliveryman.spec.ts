import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { DeleteDeliverymanUseCase } from './delete-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: DeleteDeliverymanUseCase

// sut - System Under Test

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new DeleteDeliverymanUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to delete a deliveryman', async () => {
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
    })

    expect(inMemoryDeliverymanRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a answer from another user', async () => {
    const newDeliveryman = makeDeliveryman(
      {
        cpf: '12345',
      },
      new UniqueEntityID('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(newDeliveryman)

    const result = await sut.execute({
      cpf: newDeliveryman.cpf,
      deliverymanId: 'deliveryman-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
