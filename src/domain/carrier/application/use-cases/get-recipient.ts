import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { RecipientRepository } from '../repositories/recipient-repository'
import { RecipientAndPackageDetails } from '../../enterprise/value-objects/recipient-and-package-details'

interface GetRecipientUseCaseRequest {
  id: string
}

type GetRecipientUseCaseResponse = Either<
  WrongCredentialsError,
  {
    recipient: RecipientAndPackageDetails
  }
>

@Injectable()
export class GetRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    id,
  }: GetRecipientUseCaseRequest): Promise<GetRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findByIdWithPackage(id)

    if (!recipient) {
      return left(new WrongCredentialsError())
    }

    return right({
      recipient,
    })
  }
}
