/* eslint-disable @typescript-eslint/ban-types */
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { RecipientRepository } from '../repositories/recipient-repository'

interface DeleteRecipientUseCaseRequest {
  recipientId: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type DeleteRecipientUseCaseResponse = Either<NotAllowedError, null>

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    recipientId,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new NotAllowedError())
    }

    await this.recipientRepository.delete(recipient)

    return right(null)
  }
}
