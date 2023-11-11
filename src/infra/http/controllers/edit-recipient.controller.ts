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
import { EditRecipientUseCase } from '@/domain/carrier/application/use-cases/edit-recipient'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editRecipientBodySchema = z.object({
  cep: z.string(),
  city: z.string(),
  district: z.string(),
  id: z.string(),
  name: z.string(),
  residenceNumber: z.string(),
  state: z.string(),
  street: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

@Controller('/recipients')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class EditRecipientController {
  constructor(private editRecipientUseCase: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(@Body(bodyValidationPipe) body: EditRecipientBodySchema) {
    const { cep, city, district, id, name, residenceNumber, state, street } =
      body

    const result = await this.editRecipientUseCase.execute({
      cep,
      city,
      district,
      id,
      name,
      residenceNumber,
      state,
      street,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
