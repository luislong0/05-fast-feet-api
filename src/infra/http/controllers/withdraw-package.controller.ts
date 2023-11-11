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
import { WithdrawPackageUseCase } from '@/domain/carrier/application/use-cases/withdraw-package'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'

const editPackageBodySchema = z.object({
  packageId: z.string(),
  packageStatus: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editPackageBodySchema)

type EditPackageBodySchema = z.infer<typeof editPackageBodySchema>

@Controller('/packages/withdraw')
@UseGuards(AuthGuard('jwt'))
export class WithdrawPackageController {
  constructor(private withdrawPackageUseCase: WithdrawPackageUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: EditPackageBodySchema,
  ) {
    const { packageId, packageStatus } = body

    const result = await this.withdrawPackageUseCase.execute({
      packageId,
      deliverymanId: user.sub,
      packageStatus,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
