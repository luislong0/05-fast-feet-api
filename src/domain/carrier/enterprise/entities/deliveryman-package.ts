import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Package, PackageProps } from './package'
import { DeliverymanPackageCreatedEvent } from '../events/package-updated-event'

export interface DeliverymanPackageProps extends PackageProps {
  deliverymanId?: UniqueEntityID | null
}

export class DeliverymanPackage extends Package<DeliverymanPackageProps> {
  get deliverymanId() {
    return this.props.deliverymanId || null
  }

  set deliverymanId(deliverymanId: UniqueEntityID | null) {
    this.props.deliverymanId = deliverymanId
  }

  static create(
    props: Optional<DeliverymanPackageProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const deliverymanPackage = new DeliverymanPackage(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        postAt: new Date(),
      },
      id,
    )

    const isNewPackage = id

    if (isNewPackage) {
      deliverymanPackage.addDomainEvent(
        new DeliverymanPackageCreatedEvent(deliverymanPackage),
      )
    }

    return deliverymanPackage
  }
}
