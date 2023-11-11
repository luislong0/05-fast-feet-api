/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '@/infra/auth/adminGuard'
import { EditDeliverymanUseCase } from '@/domain/carrier/application/use-cases/edit-deliveryman'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const editDeliverymanBodySchema = z.object({
  cpf: z.string(),
  email: z.string().email(),
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editDeliverymanBodySchema)

type EditDeliverymanBodySchema = z.infer<typeof editDeliverymanBodySchema>

@Controller('/deliverymans')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class EditDeliverymanController {
  constructor(private editDeliverymanUseCase: EditDeliverymanUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: EditDeliverymanBodySchema,
  ) {
    const { name, email, cpf } = body

    const result = await this.editDeliverymanUseCase.execute({
      cpf,
      deliverymanId: user.sub,
      email,
      name,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
