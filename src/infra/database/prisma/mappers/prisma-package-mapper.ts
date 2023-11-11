/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliverymanPackage } from '@/domain/carrier/enterprise/entities/deliveryman-package'
import { Package as PrismaPackage, Prisma } from '@prisma/client'

export class PrismaPackageMapper {
  static toDomain(raw: PrismaPackage): DeliverymanPackage {
    return DeliverymanPackage.create(
      {
        description: raw.description,
        latitude: raw.latitude!.toNumber(),
        longitude: raw.longitude!.toNumber(),
        postAt: raw.postAt,
        recipientId:
          raw.recipientId !== null
            ? new UniqueEntityID(raw.recipientId)
            : new UniqueEntityID(),
        status: raw.status,
        title: raw.title,
        createdAt: raw.createdAt,
        deliveryAt: raw.deliveryAt ? raw.deliveryAt : null,
        deliverymanId: raw.deliverymanId
          ? new UniqueEntityID(raw.deliverymanId)
          : null,
        returnAt: raw.returnAt ? raw.returnAt : null,
        updatedAt: raw.updatedAt ? raw.updatedAt : null,
        withdrawAt: raw.withdrawAt ? raw.withdrawAt : null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    deliverymanPackage: DeliverymanPackage,
  ): Prisma.PackageUncheckedCreateInput {
    return {
      id: deliverymanPackage.id.toString(),
      description: deliverymanPackage.description,
      latitude: deliverymanPackage.latitude,
      longitude: deliverymanPackage.longitude,
      postAt: deliverymanPackage.postAt,
      status: deliverymanPackage.status,
      title: deliverymanPackage.title,
      createdAt: deliverymanPackage.createdAt,
      deliveryAt: deliverymanPackage.deliveryAt,
      deliverymanId: deliverymanPackage.deliverymanId
        ? deliverymanPackage.deliverymanId.toString()
        : null,
      recipientId: deliverymanPackage.recipientId
        ? deliverymanPackage.recipientId.toString()
        : null,
      returnAt: deliverymanPackage.returnAt
        ? deliverymanPackage.returnAt
        : null,
      updatedAt: deliverymanPackage.updatedAt
        ? deliverymanPackage.updatedAt
        : null,
      withdrawAt: deliverymanPackage.withdrawAt
        ? deliverymanPackage.withdrawAt
        : null,
    }
  }
}
