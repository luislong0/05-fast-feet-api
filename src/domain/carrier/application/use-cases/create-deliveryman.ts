import { Either, left, right } from '@/core/either'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { Injectable } from '@nestjs/common'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface CreateDeliverymanUseCaseRequest {
  name: string
  email: string
  cpf: string
  password: string
  role: string
}

type CreateDeliverymanUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class CreateDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    email,
    role,
    name,
    password,
  }: CreateDeliverymanUseCaseRequest): Promise<CreateDeliverymanUseCaseResponse> {
    const userWithSameCpf = await this.deliverymanRepository.findByCpf(cpf)

    if (userWithSameCpf) {
      return left(new UserAlreadyExistsError(userWithSameCpf.name))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      name,
      email,
      cpf,
      password: hashedPassword,
      role,
    })

    await this.deliverymanRepository.create(deliveryman)

    return right({
      deliveryman,
    })
  }
}
