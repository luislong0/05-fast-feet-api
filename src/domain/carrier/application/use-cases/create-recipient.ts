import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientRepository } from '../repositories/recipient-repository'

interface CreateRecipientUseCaseRequest {
  name: string
  street: string
  residenceNumber: string
  district: string
  city: string
  state: string
  cep: string
  phone: string
  email: string
}

type CreateRecipientUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    newRecipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    cep,
    city,
    district,
    name,
    residenceNumber,
    state,
    street,
    email,
    phone,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const newRecipient = Recipient.create({
      cep,
      city,
      district,
      name,
      residenceNumber,
      state,
      street,
      email,
      phone,
    })

    await this.recipientRepository.create(newRecipient)

    return right({
      newRecipient,
    })
  }
}
