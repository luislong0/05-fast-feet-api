/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Upload } from '@/domain/carrier/enterprise/entities/upload'
import { Upload as PrismaUpload, Prisma } from '@prisma/client'

export class PrismaUploadMapper {
  static toDomain(raw: PrismaUpload): Upload {
    return Upload.create(
      {
        title: raw.title,
        url: raw.url,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(upload: Upload): Prisma.UploadUncheckedCreateInput {
    return {
      id: upload.id.toString(),
      title: upload.title,
      url: upload.url,
    }
  }
}
