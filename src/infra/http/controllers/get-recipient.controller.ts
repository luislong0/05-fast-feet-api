/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '@/infra/auth/adminGuard'
import { GetRecipientUseCase } from '@/domain/carrier/application/use-cases/get-recipient'
import { RecipientAndPackagePresenter } from '../presenters/recipient-and-package-presenter'

@Controller('/recipients/:id')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class GetRecipientController {
  constructor(private getRecipientUseCase: GetRecipientUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const result = await this.getRecipientUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      recipient: RecipientAndPackagePresenter.toHTTP(result.value.recipient),
    }
  }
}
