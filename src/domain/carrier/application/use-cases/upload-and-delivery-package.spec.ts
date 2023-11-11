import { InMemoryDeliverymanPackageRepository } from 'test/repositories/in-memory-deliveryman-package-repository'
import { InvalidAttachmentType } from './errors/invalid-attachment-type'
import { FakeUploader } from 'test/cryptography/storage/fake-uploader'
import { InMemoryUploadRepository } from 'test/repositories/in-memory-upload-repository'
import { UploadAndDeliveryPackageUseCase } from './upload-and-delivery-package'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeliverymanPackage } from 'test/factories/make-deliveryman-package'

let inMemoryDeliverymanPackageRepository: InMemoryDeliverymanPackageRepository
let inMemoryUploadRepository: InMemoryUploadRepository
let fakeUploader: FakeUploader

let sut: UploadAndDeliveryPackageUseCase

// sut - System Under Test

describe('Upload and delivery attachment', () => {
  beforeEach(() => {
    inMemoryDeliverymanPackageRepository =
      new InMemoryDeliverymanPackageRepository()
    inMemoryUploadRepository = new InMemoryUploadRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadAndDeliveryPackageUseCase(
      inMemoryDeliverymanPackageRepository,
      inMemoryUploadRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and delivery an attachment', async () => {
    const user = makeDeliveryman(
      {
        cpf: '12345',
      },
      new UniqueEntityID('deliveryman-1'),
    )

    const newPackage = makeDeliverymanPackage({
      recipientId: new UniqueEntityID('recipient-1'),
      deliverymanId: user.id,
      status: 'WITHDRAWN',
    })

    await inMemoryDeliverymanPackageRepository.create(newPackage)

    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
      deliverymanId: user.id.toString(),
      packageId: newPackage.id.toString(),
      packageStatus: newPackage.status,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryPackage: inMemoryDeliverymanPackageRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const user = makeDeliveryman(
      {
        cpf: '12345',
      },
      new UniqueEntityID('deliveryman-1'),
    )

    const newPackage = makeDeliverymanPackage({
      recipientId: new UniqueEntityID('recipient-1'),
      deliverymanId: user.id,
      status: 'WITHDRAWN',
    })

    await inMemoryDeliverymanPackageRepository.create(newPackage)

    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/mpeg',
      body: Buffer.from(''),
      deliverymanId: user.id.toString(),
      packageId: newPackage.id.toString(),
      packageStatus: newPackage.status,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentType)
  })
})
