/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateRecipientUseCase } from '@/domain/carrier/application/use-cases/create-recipient'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '@/infra/auth/adminGuard'

const createRecipientBodySchema = z.object({
  cep: z.string(),
  city: z.string(),
  district: z.string(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  residenceNumber: z.string(),
  state: z.string(),
  street: z.string(),
})

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class CreateRecipientController {
  constructor(private createRecipientUseCase: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async handle(@Body() body: CreateRecipientBodySchema) {
    const {
      cep,
      city,
      district,
      email,
      name,
      phone,
      residenceNumber,
      state,
      street,
    } = body

    const result = await this.createRecipientUseCase.execute({
      cep,
      city,
      district,
      email,
      name,
      phone,
      residenceNumber,
      state,
      street,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
