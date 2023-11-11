import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { CreateDeliverymanUseCase } from './create-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher

let sut: CreateDeliverymanUseCase

// sut - System Under Test

describe('Create deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateDeliverymanUseCase(
      inMemoryDeliverymanRepository,
      fakeHasher,
    )
  })

  it('should be able to create a deliveryman', async () => {
    const result = await sut.execute({
      email: 'john@example.com',
      role: 'admin',
      name: 'John doe',
      cpf: '12345',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
