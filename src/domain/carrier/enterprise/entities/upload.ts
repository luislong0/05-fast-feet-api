import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface UploadProps {
  title: string
  url: string
}

export class Upload extends Entity<UploadProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  static create(props: UploadProps, id?: UniqueEntityID) {
    const upload = new Upload(props, id)

    return upload
  }
}
