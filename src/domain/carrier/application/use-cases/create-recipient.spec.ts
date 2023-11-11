import { faker } from '@faker-js/faker'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { CreateRecipientUseCase } from './create-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase

// sut - System Under Test

describe('Create Package', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    sut = new CreateRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to create a package', async () => {
    const recipientName = faker.person.fullName()

    const result = await sut.execute({
      cep: faker.location.zipCode(),
      city: faker.location.city(),
      district: faker.location.direction(),
      name: recipientName,
      residenceNumber: faker.location.buildingNumber(),
      state: faker.location.state(),
      street: faker.location.street(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items[0].name).toEqual(recipientName)
  })
})
