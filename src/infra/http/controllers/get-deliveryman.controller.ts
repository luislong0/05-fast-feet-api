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
import { GetDeliveryManInfoUseCase } from '@/domain/carrier/application/use-cases/get-deliveryman-info'
import { DeliverymanPresenter } from '../presenters/deliveryman-presenter'

@Controller('/deliverymans/:cpf')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class GetDeliverymanController {
  constructor(private getDeliverymanInfoUseCase: GetDeliveryManInfoUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('cpf') cpf: string) {
    const result = await this.getDeliverymanInfoUseCase.execute({
      cpf,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      deliveryman: DeliverymanPresenter.toHTTP(result.value.deliveryman),
    }
  }
}
