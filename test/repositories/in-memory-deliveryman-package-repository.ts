import { DomainEvents } from '@/core/events/domain-events'
import { FindManyNearbyParams } from '@/core/repositories/find-many-nerby-params'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { getDistanceBetweenCoordinates } from '@/core/utils/get-distance-between-coordinates'
import { DeliverymanPackageRepository } from '@/domain/carrier/application/repositories/deliveryman-package-repository'
import { DeliverymanPackage } from '@/domain/carrier/enterprise/entities/deliveryman-package'

export class InMemoryDeliverymanPackageRepository
  implements DeliverymanPackageRepository
{
  public items: DeliverymanPackage[] = []

  async findById(id: string): Promise<DeliverymanPackage | null> {
    const deliverymanPackage = this.items.find(
      (item) => item.id.toString() === id,
    )

    if (!deliverymanPackage) {
      return null
    }

    return deliverymanPackage
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<DeliverymanPackage[]> {
    const packages = this.items
      .filter((item) => item.deliverymanId!.toString() === deliverymanId)
      .slice((page - 1) * 20, page * 20)

    return packages
  }

  async findManyNearby(
    deliverymanId: string,
    { userLatitude, userLongitude, page }: FindManyNearbyParams,
  ): Promise<DeliverymanPackage[]> {
    return this.items
      .filter((item) => {
        const distance = getDistanceBetweenCoordinates(
          { latitude: userLatitude, longitude: userLongitude },
          {
            latitude: item.latitude,
            longitude: item.longitude,
          },
        )

        if (item.deliverymanId!.toString() === deliverymanId) {
          return distance < 10
        } else return null
      })
      .slice((page - 1) * 20, page * 20)
  }

  async create(deliverymanPackage: DeliverymanPackage): Promise<void> {
    this.items.push(deliverymanPackage)
  }

  async save(deliverymanPackage: DeliverymanPackage): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliverymanPackage.id,
    )
    this.items[itemIndex] = deliverymanPackage

    DomainEvents.dispatchEventsForAggregate(deliverymanPackage.id)
  }

  async delete(deliverymanPackage: DeliverymanPackage): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliverymanPackage.id,
    )
    this.items.splice(itemIndex, 1)
  }
}
