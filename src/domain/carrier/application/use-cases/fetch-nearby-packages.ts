import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import { DeliverymanPackageRepository } from '../repositories/deliveryman-package-repository'
import { DeliverymanPackage } from '../../enterprise/entities/deliveryman-package'

interface FetchNearbyPackagesUseCaseRequest {
  deliverymanId: string
  userLatitude: number
  userLongitude: number
  page: number
}

type FetchNearbyPackagesUseCaseResponse = Either<
  null,
  {
    packages: DeliverymanPackage[]
  }
>

@Injectable()
export class FetchNearbyPackagesUseCase {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
  ) {}

  async execute({
    deliverymanId,
    userLatitude,
    userLongitude,
    page,
  }: FetchNearbyPackagesUseCaseRequest): Promise<FetchNearbyPackagesUseCaseResponse> {
    const packages = await this.deliverymanPackageRepository.findManyNearby(
      deliverymanId,
      { userLatitude, userLongitude, page },
    )

    return right({
      packages,
    })
  }
}
