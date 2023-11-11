import { RecipientAndPackageDetails } from '@/domain/carrier/enterprise/value-objects/recipient-and-package-details'
import { RecipientRepository } from 'src/domain/carrier/application/repositories/recipient-repository'
import { Recipient } from 'src/domain/carrier/enterprise/entities/recipient'
import { InMemoryDeliverymanPackageRepository } from './in-memory-deliveryman-package-repository'

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  constructor(
    private packageRepository: InMemoryDeliverymanPackageRepository,
  ) {}

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findByIdWithPackage(
    id: string,
  ): Promise<RecipientAndPackageDetails | null> {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    console.log(recipient.id.toString())

    const pack = this.packageRepository.items.find((pack) => {
      return pack.recipientId.equals(recipient.id)
    })

    console.log(pack?.recipientId.toString())

    if (!pack) {
      throw new Error(
        `Package with RecipientId "${recipient.id.toString()} does not exist"`,
      )
    }

    const recipientWithPackage: RecipientAndPackageDetails =
      RecipientAndPackageDetails.create({
        recipientId: recipient.id,
        name: recipient.name,
        street: recipient.street,
        residenceNumber: recipient.residenceNumber,
        district: recipient.street,
        city: recipient.city,
        state: recipient.state,
        cep: recipient.cep,
        phone: recipient.phone,
        packageId: pack.id,
        status: pack.status,
        postAt: pack.postAt,
        createdAt: pack.createdAt,
        updatedAt: pack.updatedAt,
        withdrawAt: pack.withdrawAt,
        deliveryAt: pack.deliveryAt,
        returnAt: pack.returnAt,
      })

    return recipientWithPackage
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)
    this.items[itemIndex] = recipient
  }

  async delete(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)
    this.items.splice(itemIndex, 1)
  }
}
