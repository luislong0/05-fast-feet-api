import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { Injectable } from '@nestjs/common'
import { DeliverymanPackageCreatedEvent } from '@/domain/carrier/enterprise/events/package-updated-event'
import { DeliverymanPackageRepository } from '@/domain/carrier/application/repositories/deliveryman-package-repository'

@Injectable()
export class OnPackageUpdated implements EventHandler {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendPackageUpdatedNotification.bind(this),
      DeliverymanPackageCreatedEvent.name,
    )
  }

  private async sendPackageUpdatedNotification({
    deliverymanPackage,
  }: DeliverymanPackageCreatedEvent) {
    const question = await this.deliverymanPackageRepository.findById(
      deliverymanPackage.id.toString(),
    )

    console.log(question?.recipientId)

    if (question) {
      await this.sendNotification.execute({
        recipientId: question.recipientId!.toString(),
        title: `Novo comentário em "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: 'question.excerpt',
      })
    }
  }
}
