import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { DeliverymanRepository } from '@/domain/carrier/application/repositories/deliveryman-repository'
import { Deliveryman } from '@/domain/carrier/enterprise/entities/deliveryman'
import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper'

@Injectable()
export class PrismaDeliverymanRepository implements DeliverymanRepository {
  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        cpf,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.create({
      data,
    })
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.user.delete({
      where: {
        id: data.id,
      },
    })
  }
}
