import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliverymanPackage } from '../../enterprise/entities/deliveryman-package'
import { DeliverymanPackageRepository } from '../repositories/deliveryman-package-repository'

interface EditPackageUseCaseRequest {
  id: string
  latitude: number
  longitude: number
  title: string
  description: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type EditPackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    updatedPackage: DeliverymanPackage
  }
>

@Injectable()
export class EditPackageUseCase {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
  ) {}

  async execute({
    latitude,
    longitude,
    title,
    description,
    id,
  }: EditPackageUseCaseRequest): Promise<EditPackageUseCaseResponse> {
    const updatedPackage = await this.deliverymanPackageRepository.findById(id)

    if (!updatedPackage) {
      return left(new ResourceNotFoundError())
    }

    if (id !== updatedPackage.id.toString()) {
      return left(new NotAllowedError())
    }

    updatedPackage.latitude = latitude
    updatedPackage.longitude = longitude
    updatedPackage.title = title
    updatedPackage.description = description

    await this.deliverymanPackageRepository.save(updatedPackage)

    return right({
      updatedPackage,
    })
  }
}
