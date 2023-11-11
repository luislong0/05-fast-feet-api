import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientAndPackageDetails } from '../../enterprise/value-objects/recipient-and-package-details'

export abstract class RecipientRepository {
  abstract findById(id: string): Promise<Recipient | null>

  abstract findByIdWithPackage(
    id: string,
  ): Promise<RecipientAndPackageDetails | null>

  abstract create(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
}
