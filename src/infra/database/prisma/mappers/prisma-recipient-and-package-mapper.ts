import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RecipientAndPackageDetails } from '@/domain/carrier/enterprise/value-objects/recipient-and-package-details'
import {
  Recipient as PrismaRecipient,
  Package as PrismaPackage,
} from '@prisma/client'

export type PrismaRecipientAndPackage = PrismaRecipient & {
  packages: PrismaPackage
}

export class PrismaRecipientAndPackageMapper {
  static toDomain(raw: PrismaRecipientAndPackage): RecipientAndPackageDetails {
    return RecipientAndPackageDetails.create({
      cep: raw.cep,
      city: raw.city,
      createdAt: raw.createdAt,
      district: raw.district,
      name: raw.name,
      packageId: new UniqueEntityID(raw.packages.id),
      phone: raw.phone,
      postAt: raw.packages.postAt,
      recipientId: new UniqueEntityID(raw.id),
      residenceNumber: raw.residenceNumber,
      state: raw.state,
      status: raw.packages.status,
      street: raw.street,
      deliveryAt: raw.packages.deliveryAt,
      returnAt: raw.packages.returnAt,
      updatedAt: raw.packages.updatedAt,
      withdrawAt: raw.packages.withdrawAt,
    })
  }
}
