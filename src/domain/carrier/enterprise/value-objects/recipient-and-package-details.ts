import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

export interface RecipientAndPackageDetailsProps {
  recipientId: UniqueEntityID
  name: string
  street: string
  residenceNumber: string
  district: string
  city: string
  state: string
  cep: string
  phone: string
  packageId: UniqueEntityID
  status: string
  postAt: Date
  createdAt: Date
  updatedAt?: Date | null
  withdrawAt?: Date | null
  deliveryAt?: Date | null
  returnAt?: Date | null
}

export class RecipientAndPackageDetails extends ValueObject<RecipientAndPackageDetailsProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get name() {
    return this.props.name
  }

  get street() {
    return this.props.street
  }

  get residenceNumber() {
    return this.props.residenceNumber
  }

  get district() {
    return this.props.district
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get cep() {
    return this.props.cep
  }

  get phone() {
    return this.props.phone
  }

  get packageId() {
    return this.props.packageId
  }

  get status() {
    return this.props.status
  }

  get postAt() {
    return this.props.postAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get withdrawAt() {
    return this.props.withdrawAt
  }

  get deliveryAt() {
    return this.props.deliveryAt
  }

  get returnAt() {
    return this.props.returnAt
  }

  static create(props: RecipientAndPackageDetailsProps) {
    return new RecipientAndPackageDetails(props)
  }
}
