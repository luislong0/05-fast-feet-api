import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliverymanPackage } from '../../enterprise/entities/deliveryman-package'
import { DeliverymanPackageRepository } from '../repositories/deliveryman-package-repository'

interface PostPackageUseCaseRequest {
  packageId: string
  deliverymanId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type PostPackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    postedPackage: DeliverymanPackage
  }
>

@Injectable()
export class PostPackageUseCase {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
  ) {}

  async execute({
    packageId,
  }: PostPackageUseCaseRequest): Promise<PostPackageUseCaseResponse> {
    const postedPackage =
      await this.deliverymanPackageRepository.findById(packageId)

    if (!postedPackage) {
      return left(new ResourceNotFoundError())
    }

    if (packageId !== postedPackage.id.toString()) {
      return left(new NotAllowedError())
    }

    postedPackage.status = 'WAITING'
    postedPackage.postAt = new Date()

    await this.deliverymanPackageRepository.save(postedPackage)

    return right({
      postedPackage,
    })
  }
}
