import {
  DeliverymanPackage,
  DeliverymanPackageProps,
} from '@/domain/carrier/enterprise/entities/deliveryman-package'
import { PrismaPackageMapper } from '@/infra/database/prisma/mappers/prisma-package-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export function makeDeliverymanPackage(
  override: Partial<DeliverymanPackageProps> = {},
  id?: UniqueEntityID,
) {
  const deliverymanPackage = DeliverymanPackage.create(
    {
      postAt: new Date(),
      recipientId: new UniqueEntityID('recipient-2'),
      status: 'packing',
      deliverymanId: new UniqueEntityID('recipient-1'),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      title: faker.lorem.slug(),
      description: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return deliverymanPackage
}

@Injectable()
export class DeliverymanPackageFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliverymanPackage(
    data: Partial<DeliverymanPackageProps> = {},
  ): Promise<DeliverymanPackage> {
    const deliverymanpackage = makeDeliverymanPackage(
      data,
      new UniqueEntityID(randomUUID()),
    )

    await this.prisma.package.create({
      data: PrismaPackageMapper.toPrisma(deliverymanpackage),
    })

    return deliverymanpackage
  }
}
