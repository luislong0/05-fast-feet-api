import { RecipientAndPackageDetails } from '@/domain/carrier/enterprise/value-objects/recipient-and-package-details'

export class RecipientAndPackagePresenter {
  static toHTTP(recipientAndPackage: RecipientAndPackageDetails) {
    return {
      recipientId: recipientAndPackage.recipientId.toString(),
      name: recipientAndPackage.name,
      street: recipientAndPackage.street,
      residenceNumber: recipientAndPackage.residenceNumber,
      district: recipientAndPackage.district,
      city: recipientAndPackage.city,
      state: recipientAndPackage.state,
      cep: recipientAndPackage.cep,
      phone: recipientAndPackage.phone,
      packageId: recipientAndPackage.packageId,
      status: recipientAndPackage.state,
      postAt: recipientAndPackage.postAt,
      createdAt: recipientAndPackage.createdAt,
      updatedAt: recipientAndPackage.updatedAt,
      withdrawAt: recipientAndPackage.withdrawAt,
      deliveryAt: recipientAndPackage.deliveryAt,
      returnAt: recipientAndPackage.returnAt,
    }
  }
}
