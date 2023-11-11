/* eslint-disable @typescript-eslint/ban-types */
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'

interface DeleteDeliverymanUseCaseRequest {
  deliverymanId: string
  cpf: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type DeleteDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
    cpf,
  }: DeleteDeliverymanUseCaseRequest): Promise<DeleteDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findByCpf(cpf)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    if (deliverymanId !== deliveryman.id.toString()) {
      return left(new NotAllowedError())
    }

    await this.deliverymanRepository.delete(deliveryman)

    return right(null)
  }
}
