import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { Injectable } from '@nestjs/common'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'

interface EditDeliverymanUseCaseRequest {
  name: string
  email: string
  cpf: string
  deliverymanId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type EditDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class EditDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    email,
    name,
    deliverymanId,
    cpf,
  }: EditDeliverymanUseCaseRequest): Promise<EditDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findByCpf(cpf)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    if (deliverymanId !== deliveryman.id.toString()) {
      return left(new NotAllowedError())
    }

    deliveryman.name = name

    deliveryman.email = email

    await this.deliverymanRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}
