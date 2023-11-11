import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { DeliverymanPackage } from '../../enterprise/entities/deliveryman-package'
import { DeliverymanPackageRepository } from '../repositories/deliveryman-package-repository'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { Uploader } from '../storage/uploader'
import { UploadRepository } from '../repositories/upload-repository'
import { Upload } from '../../enterprise/entities/upload'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface UploadAndDeliveryPackageUseCaseRequest {
  packageId: string
  deliverymanId: string
  packageStatus: string
  fileName: string
  fileType: string
  body: Buffer
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type UploadAndDeliveryPackageUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    deliveryPackage: DeliverymanPackage
  }
>

@Injectable()
export class UploadAndDeliveryPackageUseCase {
  constructor(
    private deliverymanPackageRepository: DeliverymanPackageRepository,
    private uploadRepository: UploadRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    packageId,
    packageStatus,
    deliverymanId,
    body,
    fileName,
    fileType,
  }: UploadAndDeliveryPackageUseCaseRequest): Promise<UploadAndDeliveryPackageUseCaseResponse> {
    const deliveryPackage =
      await this.deliverymanPackageRepository.findById(packageId)

    if (!deliveryPackage) {
      return left(new ResourceNotFoundError())
    }

    if (
      packageStatus !== deliveryPackage.status &&
      deliverymanId !== deliveryPackage.deliverymanId?.toString()
    ) {
      return left(new NotAllowedError())
    }

    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentType(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const upload = Upload.create(
      {
        title: fileName,
        url,
      },
      new UniqueEntityID(),
    )

    await this.uploadRepository.create(upload)

    if (url && deliverymanId === deliveryPackage.deliverymanId?.toString()) {
      deliveryPackage.status = 'DELIVERY'
      deliveryPackage.deliveryAt = new Date()
    }

    await this.deliverymanPackageRepository.save(deliveryPackage)

    return right({
      deliveryPackage,
    })
  }
}
