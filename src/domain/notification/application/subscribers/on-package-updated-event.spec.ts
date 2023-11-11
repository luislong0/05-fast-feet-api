import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { OnPackageUpdated } from './on-package-updated-event'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'
import { makeRecipient } from 'test/factories/make-recipient'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Question Comment Created', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    // eslint-disable-next-line no-new
    new OnPackageUpdated(
      inMemoryDeliverymanPackageRepository,
      sendNotificationUseCase,
    )
  })

  it('should send a notification when an question comment is created', async () => {
    const newRecipient = makeRecipient()
    const newPackage = makeDeliverymanPackage(
      {
        recipientId: newRecipient.id,
      },
      new UniqueEntityID('package-1'),
    )

    await inMemoryDeliverymanPackageRepository.create(newPackage)

    newPackage.status = 'testing'

    await inMemoryDeliverymanPackageRepository.save(newPackage)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
