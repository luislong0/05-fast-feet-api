import { Upload } from '../../enterprise/entities/upload'

export abstract class UploadRepository {
  abstract findById(id: string): Promise<Upload | null>
  abstract create(upload: Upload): Promise<void>
  // abstract save(upload: Upload): Promise<void>
  // abstract delete(upload: Upload): Promise<void>
}
