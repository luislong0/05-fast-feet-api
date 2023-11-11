import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { Deliveryman } from '../../enterprise/entities/deliveryman'

interface ChangeUserPasswordUseCaseRequest {
  cpf: string
  password: string
}

type ChangeUserPasswordUseCaseResponse = Either<
  WrongCredentialsError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class ChangeUserPasswordUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    password,
  }: ChangeUserPasswordUseCaseRequest): Promise<ChangeUserPasswordUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findByCpf(cpf)

    if (!deliveryman) {
      return left(new WrongCredentialsError())
    }

    const ifCpfValid = deliveryman.cpf === cpf

    if (!ifCpfValid) {
      return left(new WrongCredentialsError())
    }

    const newHashedPassword = await this.hashGenerator.hash(password)

    deliveryman.password = newHashedPassword

    await this.deliverymanRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}
