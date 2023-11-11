import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { ChangeUserPasswordUseCase } from './change-user-password'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher

let sut: ChangeUserPasswordUseCase

// sut - System Under Test

describe('Change user Password', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()
    sut = new ChangeUserPasswordUseCase(
      inMemoryDeliverymanRepository,
      fakeHasher,
    )
  })

  it('should be able to change a user password', async () => {
    const user = makeDeliveryman({
      email: 'john@example.com',
      cpf: '12345',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliverymanRepository.items.push(user)

    const passwordHashed = await fakeHasher.hash('1234567')

    const result = await sut.execute({
      cpf: '12345',
      password: '1234567',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].password).toEqual(
      passwordHashed,
    )
  })
})
