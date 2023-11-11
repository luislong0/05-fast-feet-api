/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/carrier/enterprise/entities/deliveryman'
import { User as PrismaUser, Prisma, UserRole } from '@prisma/client'

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaUser): Deliveryman {
    return Deliveryman.create(
      {
        name: raw.name,
        email: raw.email!,
        password: raw.password!,
        cpf: raw.cpf!,
        role: raw.role,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(deliveryman: Deliveryman): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      email: deliveryman.email,
      password: deliveryman.password,
      cpf: deliveryman.cpf,
      role: deliveryman.role as UserRole,
    }
  }
}
