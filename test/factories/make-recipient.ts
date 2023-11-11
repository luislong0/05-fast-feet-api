import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/prisma-recipient-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import {
  Recipient,
  RecipientProps,
} from 'src/domain/carrier/enterprise/entities/recipient'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      cep: faker.location.zipCode(),
      city: faker.location.city(),
      district: faker.location.direction(),
      name: faker.person.fullName(),
      residenceNumber: faker.location.buildingNumber(),
      state: faker.location.state(),
      street: faker.location.street(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      ...override,
    },
    id,
  )

  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(
    data: Partial<RecipientProps> = {},
  ): Promise<Recipient> {
    const recipient = makeRecipient(data, new UniqueEntityID(randomUUID()))

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient),
    })

    return recipient
  }
}
