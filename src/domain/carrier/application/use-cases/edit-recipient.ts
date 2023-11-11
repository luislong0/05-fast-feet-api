import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'
import { RecipientRepository } from '../repositories/recipient-repository'

interface EditRecipientUseCaseRequest {
  id: string
  name: string
  street: string
  residenceNumber: string
  district: string
  city: string
  state: string
  cep: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type EditRecipientUseCaseResponse = Either<
  NotAllowedError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    cep,
    city,
    district,
    id,
    name,
    residenceNumber,
    state,
    street,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(id)

    if (!recipient) {
      return left(new NotAllowedError())
    }

    recipient.name = name
    recipient.cep = cep
    recipient.city = city
    recipient.district = district
    recipient.residenceNumber = residenceNumber
    recipient.state = state
    recipient.street = street

    await this.recipientRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
