import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliverymanPackage } from '../../enterprise/entities/deliveryman-package'
import { DeliverymanPackageRepository } from '../repositories/deliveryman-package-repository'

interface ReturnPackageUseCaseRequest {
  packageId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type ReturnPackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    returnedPackage: DeliverymanPackage
  }
>

@Injectable()
export class ReturnPackageUseCase {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
  ) {}

  async execute({
    packageId,
  }: ReturnPackageUseCaseRequest): Promise<ReturnPackageUseCaseResponse> {
    const returnedPackage =
      await this.deliverymanPackageRepository.findById(packageId)

    if (!returnedPackage) {
      return left(new ResourceNotFoundError())
    }

    if (packageId !== returnedPackage.id.toString()) {
      return left(new NotAllowedError())
    }

    returnedPackage.status = 'RETURNED'
    returnedPackage.returnAt = new Date()

    await this.deliverymanPackageRepository.save(returnedPackage)

    return right({
      returnedPackage,
    })
  }
}
