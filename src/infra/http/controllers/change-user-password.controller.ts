/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '@/infra/auth/adminGuard'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ChangeUserPasswordUseCase } from '@/domain/carrier/application/use-cases/change-user-password'

const changeUserPasswordBodySchema = z.object({
  newPassword: z.string(),
  cpf: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(changeUserPasswordBodySchema)

type ChangeUserPasswordBodySchema = z.infer<typeof changeUserPasswordBodySchema>

@Controller('/users/change-password')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class ChangeUserPasswordController {
  constructor(private changeUserPasswordUseCase: ChangeUserPasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Body(bodyValidationPipe) body: ChangeUserPasswordBodySchema) {
    const { newPassword, cpf } = body

    const result = await this.changeUserPasswordUseCase.execute({
      cpf,
      password: newPassword,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
