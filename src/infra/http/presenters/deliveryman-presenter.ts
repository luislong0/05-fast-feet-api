import { Deliveryman } from '@/domain/carrier/enterprise/entities/deliveryman'

export class DeliverymanPresenter {
  static toHTTP(deliveryman: Deliveryman) {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      email: deliveryman.email,
      role: deliveryman.role,
    }
  }
}
