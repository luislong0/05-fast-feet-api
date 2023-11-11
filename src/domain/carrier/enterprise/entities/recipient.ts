import { Entity } from 'src/core/entities/entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export interface RecipientProps {
  name: string
  street: string
  residenceNumber: string
  district: string
  city: string
  state: string
  cep: string
  email: string
  phone: string
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get street() {
    return this.props.street
  }

  set street(street: string) {
    this.props.street = street
  }

  get residenceNumber() {
    return this.props.residenceNumber
  }

  set residenceNumber(residenceNumber: string) {
    this.props.residenceNumber = residenceNumber
  }

  get district() {
    return this.props.district
  }

  set district(district: string) {
    this.props.district = district
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city
  }

  get state() {
    return this.props.state
  }

  set state(state: string) {
    this.props.state = state
  }

  get cep() {
    return this.props.cep
  }

  set cep(cep: string) {
    this.props.cep = cep
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
  }

  static create(props: RecipientProps, id?: UniqueEntityID) {
    const deliveryman = new Recipient(props, id)

    return deliveryman
  }
}
