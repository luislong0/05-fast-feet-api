import { UploadRepository } from 'src/domain/carrier/application/repositories/upload-repository'
import { Upload } from 'src/domain/carrier/enterprise/entities/upload'

export class InMemoryUploadRepository implements UploadRepository {
  public items: Upload[] = []

  async findById(id: string): Promise<Upload | null> {
    const upload = this.items.find((item) => item.id.toString() === id)

    if (!upload) {
      return null
    }

    return upload
  }

  async create(upload: Upload): Promise<void> {
    this.items.push(upload)
  }
}
