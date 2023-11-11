import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliverymanPackage } from '../../enterprise/entities/deliveryman-package'
import { DeliverymanPackageRepository } from '../repositories/deliveryman-package-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface WithdrawPackageUseCaseRequest {
  packageId: string
  deliverymanId: string
  packageStatus: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type WithdrawPackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    withdrawPackage: DeliverymanPackage
  }
>

@Injectable()
export class WithdrawPackageUseCase {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
  ) {}

  async execute({
    packageId,
    packageStatus,
    deliverymanId,
  }: WithdrawPackageUseCaseRequest): Promise<WithdrawPackageUseCaseResponse> {
    const withdrawPackage =
      await this.deliverymanPackageRepository.findById(packageId)

    if (!withdrawPackage) {
      return left(new ResourceNotFoundError())
    }

    if (packageStatus !== withdrawPackage.status) {
      return left(new NotAllowedError())
    }

    if (withdrawPackage.status === 'WAITING') {
      withdrawPackage.status = 'WITHDRAWN'
      withdrawPackage.withdrawAt = new Date()
      withdrawPackage.deliverymanId = new UniqueEntityID(deliverymanId)
    }

    await this.deliverymanPackageRepository.save(withdrawPackage)

    return right({
      withdrawPackage,
    })
  }
}
