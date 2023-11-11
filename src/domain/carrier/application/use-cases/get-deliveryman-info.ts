import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetDeliveryManInfoUseCaseRequest {
  cpf: string
}

type GetDeliveryManInfoUseCaseResponse = Either<
  WrongCredentialsError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class GetDeliveryManInfoUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    cpf,
  }: GetDeliveryManInfoUseCaseRequest): Promise<GetDeliveryManInfoUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findByCpf(cpf)

    if (!deliveryman) {
      return left(new WrongCredentialsError())
    }

    const ifCpfValid = deliveryman.cpf === cpf

    if (!ifCpfValid) {
      return left(new UserNotFoundError())
    }

    return right({
      deliveryman,
    })
  }
}
