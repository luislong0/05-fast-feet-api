import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface PackageProps {
  recipientId: UniqueEntityID
  title: string
  description: string
  latitude: number
  longitude: number
  status: string
  postAt: Date
  createdAt: Date
  updatedAt?: Date | null
  withdrawAt?: Date | null
  deliveryAt?: Date | null
  returnAt?: Date | null
}

export abstract class Package<
  Props extends PackageProps,
> extends AggregateRoot<Props> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get latitude() {
    return this.props.latitude
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude
    this.touch()
  }

  get longitude() {
    return this.props.longitude
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get postAt() {
    return this.props.postAt
  }

  set postAt(postAt: Date) {
    this.props.postAt = postAt
    this.touch()
  }

  get withdrawAt() {
    return this.props.withdrawAt
  }

  set withdrawAt(withdrawAt: Date | null | undefined) {
    this.props.withdrawAt = withdrawAt
    this.touch()
  }

  get deliveryAt() {
    return this.props.deliveryAt
  }

  set deliveryAt(deliveryAt: Date | null | undefined) {
    this.props.deliveryAt = deliveryAt
    this.touch()
  }

  get returnAt() {
    return this.props.returnAt
  }

  set returnAt(returnAt: Date | null | undefined) {
    this.props.returnAt = returnAt
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }
}
