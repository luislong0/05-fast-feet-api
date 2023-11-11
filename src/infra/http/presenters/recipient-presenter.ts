import { Recipient } from '@/domain/carrier/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      cep: recipient.cep,
      city: recipient.city,
      district: recipient.district,
      email: recipient.email,
      name: recipient.name,
      phone: recipient.phone,
      residenceNumber: recipient.residenceNumber,
      state: recipient.state,
      street: recipient.street,
    }
  }
}
