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
import { GetPackageUseCase } from '@/domain/carrier/application/use-cases/get-package'
import { PackagePresenter } from '../presenters/package-presenter'

@Controller('/packages/:id')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class GetPackageController {
  constructor(private getPackageUseCase: GetPackageUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') id: string) {
    const result = await this.getPackageUseCase.execute({
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      package: PackagePresenter.toHTTP(result.value.deliverymanPackage),
    }
  }
}
