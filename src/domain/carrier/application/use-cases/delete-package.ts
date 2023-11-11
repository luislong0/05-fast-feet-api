/* eslint-disable @typescript-eslint/ban-types */
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { DeliverymanPackageRepository } from '../repositories/deliveryman-package-repository'

interface DeletePackageUseCaseRequest {
  packageId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type DeletePackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeletePackageUseCase {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
  ) {}

  async execute({
    packageId,
  }: DeletePackageUseCaseRequest): Promise<DeletePackageUseCaseResponse> {
    const selectedPackage =
      await this.deliverymanPackageRepository.findById(packageId)

    if (!selectedPackage) {
      return left(new ResourceNotFoundError())
    }

    await this.deliverymanPackageRepository.delete(selectedPackage)

    return right(null)
  }
}
