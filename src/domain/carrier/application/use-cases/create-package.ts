import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { DeliverymanPackage } from '../../enterprise/entities/deliveryman-package'
import { DeliverymanPackageRepository } from '../repositories/deliveryman-package-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreatePackageUseCaseRequest {
  recipientId: UniqueEntityID
  title: string
  description: string
  latitude: number
  longitude: number
  status: string
  postAt: Date
  withdrawAt?: Date | null
  deliveryAt?: Date | null
}

type CreatePackageUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    newPackage: DeliverymanPackage
  }
>

@Injectable()
export class CreatePackageUseCase {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
  ) {}

  async execute({
    postAt,
    recipientId,
    status,
    latitude,
    longitude,
    description,
    title,
  }: CreatePackageUseCaseRequest): Promise<CreatePackageUseCaseResponse> {
    const newPackage = DeliverymanPackage.create({
      latitude,
      longitude,
      postAt,
      recipientId,
      status,
      description,
      title,
    })

    await this.deliverymanPackageRepository.create(newPackage)

    return right({
      newPackage,
    })
  }
}
