import { DeliverymanRepository } from 'src/domain/carrier/application/repositories/deliveryman-repository'
import { Deliveryman } from 'src/domain/carrier/enterprise/entities/deliveryman'

export class InMemoryDeliverymanRepository implements DeliverymanRepository {
  public items: Deliveryman[] = []

  async findByCpf(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = this.items.find((item) => item.cpf === cpf)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async create(deliveryman: Deliveryman) {
    this.items.push(deliveryman)
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)
    this.items[itemIndex] = deliveryman
  }

  async delete(deliveryman: Deliveryman): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)
    this.items.splice(itemIndex, 1)
  }
}
