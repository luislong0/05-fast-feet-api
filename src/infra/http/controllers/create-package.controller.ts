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
import { CreatePackageUseCase } from '@/domain/carrier/application/use-cases/create-package'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '@/infra/auth/adminGuard'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

const createPackageBodySchema = z.object({
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  postAt: z.string(),
  recipientId: z.string(),
  status: z.string(),
  title: z.string(),
})

type CreatePackageBodySchema = z.infer<typeof createPackageBodySchema>

@Controller('/packages')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class CreatePackageController {
  constructor(private createPackageUseCase: CreatePackageUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createPackageBodySchema))
  async handle(@Body() body: CreatePackageBodySchema) {
    const {
      description,
      latitude,
      longitude,
      postAt,
      recipientId,
      status,
      title,
    } = body

    const result = await this.createPackageUseCase.execute({
      description,
      latitude,
      longitude,
      postAt: new Date(postAt),
      recipientId: new UniqueEntityID(recipientId),
      status,
      title,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
