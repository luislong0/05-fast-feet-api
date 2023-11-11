/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateDeliverymanUseCase } from '@/domain/carrier/application/use-cases/create-deliveryman'
import { UserAlreadyExistsError } from '@/domain/carrier/application/use-cases/errors/user-already-exists-error'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '@/infra/auth/adminGuard'

const createDeliverymanBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  cpf: z.string(),
  role: z.string(),
})

type CreateDeliverymanBodySchema = z.infer<typeof createDeliverymanBodySchema>

@Controller('/deliverymans')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class CreateDeliverymanController {
  constructor(private createDeliveryman: CreateDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDeliverymanBodySchema))
  async handle(@Body() body: CreateDeliverymanBodySchema) {
    const { name, email, password, cpf, role } = body

    const result = await this.createDeliveryman.execute({
      name: name!,
      email: email!,
      password: password!,
      cpf: cpf!,
      role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
