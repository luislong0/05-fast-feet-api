/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '@/infra/auth/adminGuard'
import { DeleteRecipientUseCase } from '@/domain/carrier/application/use-cases/delete-recipient'

@Controller('/recipients/:id')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class DeleteRecipientController {
  constructor(private deleteRecipientUseCase: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const result = await this.deleteRecipientUseCase.execute({
      recipientId: id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
