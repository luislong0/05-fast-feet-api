import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeliverymanPackageRepository } from '@/domain/carrier/application/repositories/deliveryman-package-repository'
import { FindManyNearbyParams } from '@/core/repositories/find-many-nerby-params'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliverymanPackage } from '@/domain/carrier/enterprise/entities/deliveryman-package'
import { PrismaPackageMapper } from '../mappers/prisma-package-mapper'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Package as PrismaPackage } from '@prisma/client'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaDeliverymanPackageRepository
  implements DeliverymanPackageRepository
{
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
  ) {}

  async findById(id: string): Promise<DeliverymanPackage | null> {
    const pack = await this.prisma.package.findUnique({
      where: {
        id,
      },
    })

    if (!pack) {
      return null
    }

    return PrismaPackageMapper.toDomain(pack)
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<DeliverymanPackage[]> {
    const cacheHit = await this.cache.get(`question:${deliverymanId}:packages`)

    if (cacheHit) {
      console.log('cached hit')
      const cacheData = JSON.parse(cacheHit)
      console.log(cacheData)
      return cacheData
    }

    const prismaPackage = await this.prisma.package.findMany({
      where: {
        deliverymanId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    const packages = prismaPackage.map((pack) => {
      return PrismaPackageMapper.toDomain(pack)
    })

    console.log(packages)

    packages.map((pack) => {
      return console.log(JSON.stringify(pack.description))
    })

    await this.cache.set(
      `question:${deliverymanId}:packages`,
      JSON.stringify(prismaPackage),
    )

    const cachedCreated = await this.cache.get(
      `question:${deliverymanId}:packages`,
    )

    if (cachedCreated) {
      console.log('cached')
    }

    return packages
  }

  async findManyNearby(
    deliverymanId: string,
    { page, userLatitude, userLongitude }: FindManyNearbyParams,
  ): Promise<any[]> {
    const nearbyPackages = await this.prisma.$queryRaw<PrismaPackage[]>`
    SELECT * from packages
    WHERE ( 6371 * acos( cos( radians(${userLatitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${userLongitude}) ) + sin( radians(${userLatitude}) ) * sin( radians( latitude ) ) ) ) <= 10
      AND deliveryman_id = ${deliverymanId}
    LIMIT 20 OFFSET ${(page - 1) * 20}
  `

    return nearbyPackages!.map((pack) => {
      return PrismaPackageMapper.toDomain({
        createdAt: pack.createdAt,
        deliveryAt: pack.deliveryAt,
        deliverymanId: pack.deliverymanId,
        description: pack.description,
        id: pack.id,
        latitude: pack.latitude,
        longitude: pack.longitude,
        postAt: pack.postAt,
        recipientId: pack.recipientId,
        returnAt: pack.returnAt,
        status: pack.status,
        title: pack.title,
        updatedAt: pack.updatedAt,
        withdrawAt: pack.withdrawAt,
      })
    })
  }

  async create(deliverymanPackage: DeliverymanPackage): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(deliverymanPackage)

    await this.prisma.package.create({
      data,
    })
  }

  async save(deliverymanPackage: DeliverymanPackage): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(deliverymanPackage)

    await this.prisma.package.update({
      where: {
        id: data.id,
      },
      data,
    })

    this.cache.delete(`question:${data.deliverymanId}:packages`)

    DomainEvents.dispatchEventsForAggregate(deliverymanPackage.id)
  }

  async delete(deliverymanPackage: DeliverymanPackage): Promise<void> {
    const data = PrismaPackageMapper.toPrisma(deliverymanPackage)

    await this.prisma.package.delete({
      where: {
        id: data.id,
      },
    })
  }
}
