import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import { DeliverymanPackageRepository } from '../repositories/deliveryman-package-repository'
import { DeliverymanPackage } from '../../enterprise/entities/deliveryman-package'

interface FetchPackagesByDeliverymanIdUseCaseRequest {
  deliverymanId: string
  page: number
}

type FetchPackagesByDeliverymanIdUseCaseResponse = Either<
  null,
  {
    packages: DeliverymanPackage[]
  }
>

@Injectable()
export class FetchPackagesByDeliverymanIdUseCase {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
  ) {}

  async execute({
    deliverymanId,
    page,
  }: FetchPackagesByDeliverymanIdUseCaseRequest): Promise<FetchPackagesByDeliverymanIdUseCaseResponse> {
    const packages =
      await this.deliverymanPackageRepository.findManyByDeliverymanId(
        deliverymanId,
        { page },
      )

    return right({
      packages,
    })
  }
}
