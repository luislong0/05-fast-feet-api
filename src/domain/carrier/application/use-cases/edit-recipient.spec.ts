import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { EditRecipientUseCase } from './edit-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: EditRecipientUseCase

// sut - System Under Test

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to edit a recipient', async () => {
    const newRecipient = makeRecipient({}, new UniqueEntityID('recipient-1'))

    await inMemoryRecipientRepository.create(newRecipient)

    await sut.execute({
      cep: 'new cep',
      city: 'new city',
      district: 'new district',
      id: newRecipient.id.toString(),
      name: 'new name',
      residenceNumber: 'new residence number',
      state: 'new state',
      street: 'new street',
    })

    expect(inMemoryRecipientRepository.items[0]).toMatchObject({
      cep: 'new cep',
      city: 'new city',
      district: 'new district',
      name: 'new name',
      residenceNumber: 'new residence number',
      state: 'new state',
      street: 'new street',
    })
  })

  it('should not be able to edit a recipient from another user', async () => {
    const newRecipient = makeRecipient({}, new UniqueEntityID('recipient-1'))

    await inMemoryRecipientRepository.create(newRecipient)

    const result = await sut.execute({
      cep: 'new cep',
      city: 'new city',
      district: 'new district',
      id: 'testeid',
      name: 'new name',
      residenceNumber: 'new residence number',
      state: 'new state',
      street: 'new street',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
