import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliverymanPackage } from '../../enterprise/entities/deliveryman-package'
import { FindManyNearbyParams } from '@/core/repositories/find-many-nerby-params'

export abstract class DeliverymanPackageRepository {
  abstract findById(id: string): Promise<DeliverymanPackage | null>
  abstract findManyByDeliverymanId(
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<DeliverymanPackage[]>

  abstract findManyNearby(
    deliverymanId: string,
    params: FindManyNearbyParams,
  ): Promise<DeliverymanPackage[]>

  abstract create(deliverymanPackage: DeliverymanPackage): Promise<void>
  abstract save(deliverymanPackage: DeliverymanPackage): Promise<void>
  abstract delete(deliverymanPackage: DeliverymanPackage): Promise<void>
}
