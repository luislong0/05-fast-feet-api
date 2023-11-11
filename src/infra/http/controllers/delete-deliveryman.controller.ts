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
import { DeleteDeliverymanUseCase } from '@/domain/carrier/application/use-cases/delete-deliveryman'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/deliverymans/:cpf')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class DeleteDeliverymanController {
  constructor(private deleteDeliverymanUseCase: DeleteDeliverymanUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('cpf') cpf: string) {
    const result = await this.deleteDeliverymanUseCase.execute({
      cpf,
      deliverymanId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
