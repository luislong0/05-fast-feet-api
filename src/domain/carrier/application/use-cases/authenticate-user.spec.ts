import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateUserUseCase } from './authenticate-user'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateUserUseCase

// sut - System Under Test

describe('Authenticate user', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(
      inMemoryDeliverymanRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a user', async () => {
    const user = makeDeliveryman({
      email: 'john@example.com',
      cpf: '12345',
      password: await fakeHasher.hash('123456'),
    })

    inMemoryDeliverymanRepository.items.push(user)

    const result = await sut.execute({
      cpf: '12345',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
