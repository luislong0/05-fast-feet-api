import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { DeliverymanPackage } from '../entities/deliveryman-package'

export class DeliverymanPackageCreatedEvent implements DomainEvent {
  public ocurredAt: Date
  public deliverymanPackage: DeliverymanPackage

  constructor(deliverymanPackage: DeliverymanPackage) {
    this.deliverymanPackage = deliverymanPackage
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.deliverymanPackage.id
  }
}
