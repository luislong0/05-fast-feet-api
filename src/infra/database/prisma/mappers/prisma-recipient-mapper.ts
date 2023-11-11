/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/carrier/enterprise/entities/recipient'
import { Recipient as PrismaRecipient, Prisma } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        cep: raw.cep!,
        city: raw.city!,
        district: raw.district!,
        name: raw.name,
        residenceNumber: raw.residenceNumber!,
        state: raw.state!,
        street: raw.street!,
        email: raw.email!,
        phone: raw.phone!,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      cep: recipient.cep!,
      city: recipient.city!,
      district: recipient.district!,
      name: recipient.name,
      residenceNumber: recipient.residenceNumber!,
      state: recipient.state!,
      street: recipient.street!,
      email: recipient.email!,
      phone: recipient.phone!,
    }
  }
}
