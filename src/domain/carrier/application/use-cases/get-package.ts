import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { DeliverymanPackage } from '../../enterprise/entities/deliveryman-package'
import { DeliverymanPackageRepository } from '../repositories/deliveryman-package-repository'

interface GetPackageUseCaseRequest {
  id: string
}

type GetPackageUseCaseResponse = Either<
  WrongCredentialsError,
  {
    deliverymanPackage: DeliverymanPackage
  }
>

@Injectable()
export class GetPackageUseCase {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
  ) {}

  async execute({
    id,
  }: GetPackageUseCaseRequest): Promise<GetPackageUseCaseResponse> {
    const deliverymanPackage =
      await this.deliverymanPackageRepository.findById(id)

    if (!deliverymanPackage) {
      return left(new WrongCredentialsError())
    }

    return right({
      deliverymanPackage,
    })
  }
}
