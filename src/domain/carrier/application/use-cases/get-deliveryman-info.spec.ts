import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { GetDeliveryManInfoUseCase } from './get-deliveryman-info'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository

let sut: GetDeliveryManInfoUseCase

// sut - System Under Test

describe('Get Deliveryman Info', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new GetDeliveryManInfoUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to get deliveryman info', async () => {
    const user = makeDeliveryman({
      email: 'john@example.com',
      cpf: '12345',
    })

    inMemoryDeliverymanRepository.items.push(user)

    const result = await sut.execute({
      cpf: '12345',
    })

    expect(result.value).toMatchObject({
      deliveryman: expect.objectContaining({
        cpf: user.cpf,
      }),
    })
  })
})
