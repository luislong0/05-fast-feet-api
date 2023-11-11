import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { RecipientRepository } from '@/domain/carrier/application/repositories/recipient-repository'
import { Recipient } from '@/domain/carrier/enterprise/entities/recipient'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'
import { RecipientAndPackageDetails } from '@/domain/carrier/enterprise/value-objects/recipient-and-package-details'
import {
  PrismaRecipientAndPackage,
  PrismaRecipientAndPackageMapper,
} from '../mappers/prisma-recipient-and-package-mapper'

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findByIdWithPackage(
    id: string,
  ): Promise<RecipientAndPackageDetails | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
      include: {
        packages: true,
      },
    })

    if (!recipient || !recipient.packages) {
      return null
    }

    const combinedObject: PrismaRecipientAndPackage = {
      ...recipient,
      packages: recipient.packages[0], // ou escolha o pacote de forma adequada
    }

    console.log(recipient)

    return PrismaRecipientAndPackageMapper.toDomain(combinedObject)
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      },
    })
  }
}
