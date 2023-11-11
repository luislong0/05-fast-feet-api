import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { UploadRepository } from '@/domain/carrier/application/repositories/upload-repository'
import { Upload } from '@/domain/carrier/enterprise/entities/upload'
import { PrismaUploadMapper } from '../mappers/prisma-upload-mapper'

@Injectable()
export class PrismaUploadRepository implements UploadRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Upload | null> {
    const upload = await this.prisma.upload.findUnique({
      where: {
        id,
      },
    })

    if (!upload) {
      return null
    }

    return PrismaUploadMapper.toDomain(upload)
  }

  async create(upload: Upload): Promise<void> {
    const data = PrismaUploadMapper.toPrisma(upload)

    await this.prisma.upload.create({
      data,
    })
  }
}
