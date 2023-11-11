import { DeliverymanPackage } from '@/domain/carrier/enterprise/entities/deliveryman-package'

export class PackagePresenter {
  static toHTTP(packages: DeliverymanPackage) {
    return {
      id: packages.id.toString(),
      recipientId: packages.recipientId
        ? packages.recipientId.toString()
        : null,
      title: packages.title.toString(),
      description: packages.description,
      latitude: packages.latitude,
      longitude: packages.longitude,
      status: packages.status,
      postAt: packages.postAt,
      createdAt: packages.createdAt,
      updatedAt: packages.updatedAt ? packages.updatedAt : null,
      withdrawAt: packages.withdrawAt ? packages.withdrawAt : null,
      deliveryAt: packages.deliveryAt ? packages.deliveryAt : null,
      returnAt: packages.returnAt ? packages.returnAt : null,
    }
  }

  static toHTTPArray(packages: DeliverymanPackage[]) {
    packages.map((presenterPackage) => {
      return {
        id: presenterPackage.id.toString(),
        recipientId: presenterPackage.recipientId
          ? presenterPackage.recipientId.toString()
          : null,
        title: presenterPackage.title.toString(),
        description: presenterPackage.description,
        latitude: presenterPackage.latitude,
        longitude: presenterPackage.longitude,
        status: presenterPackage.status,
        postAt: presenterPackage.postAt,
        createdAt: presenterPackage.createdAt,
        updatedAt: presenterPackage.updatedAt
          ? presenterPackage.updatedAt
          : null,
        withdrawAt: presenterPackage.withdrawAt
          ? presenterPackage.withdrawAt
          : null,
        deliveryAt: presenterPackage.deliveryAt
          ? presenterPackage.deliveryAt
          : null,
        returnAt: presenterPackage.returnAt ? presenterPackage.returnAt : null,
      }
    })
  }
}
