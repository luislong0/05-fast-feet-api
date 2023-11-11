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
import { EditPackageUseCase } from '@/domain/carrier/application/use-cases/edit-package'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editPackageBodySchema = z.object({
  description: z.string(),
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  title: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editPackageBodySchema)

type EditPackageBodySchema = z.infer<typeof editPackageBodySchema>

@Controller('/packages')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class EditPackageController {
  constructor(private editPackageUseCase: EditPackageUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(@Body(bodyValidationPipe) body: EditPackageBodySchema) {
    const { description, id, latitude, longitude, title } = body

    const result = await this.editPackageUseCase.execute({
      title,
      description,
      id,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
