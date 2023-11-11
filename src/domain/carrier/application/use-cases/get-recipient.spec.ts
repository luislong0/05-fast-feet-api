import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { GetRecipientUseCase } from './get-recipient'
import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository

let sut: GetRecipientUseCase

// sut - System Under Test

describe('Get Recipient', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()

    inMemoryRecipientRepository = new InMemoryRecipientRepository(
      inMemoryDeliverymanPackageRepository,
    )
    sut = new GetRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to get recipient', async () => {
    const recipient = makeRecipient({}, new UniqueEntityID('recipient - 1'))

    const deliverymanPackage = makeDeliverymanPackage({
      recipientId: recipient.id,
    })

    console.log(recipient.id.toString())
    console.log(deliverymanPackage.recipientId.toString())

    await inMemoryDeliverymanPackageRepository.create(deliverymanPackage)
    await inMemoryRecipientRepository.items.push(recipient)

    const result = await sut.execute({
      id: recipient.id.toString(),
    })

    expect(inMemoryRecipientRepository.items[0].id).toEqual(recipient.id)
    expect(result.value).toMatchObject({
      recipient: expect.objectContaining({
        name: recipient.name,
      }),
    })
  })
})
