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
import { PackagePresenter } from '../presenters/package-presenter'
import { FetchPackagesByDeliverymanIdUseCase } from '@/domain/carrier/application/use-cases/fetch-packages-by-deliverymanId'

@Controller('/packages/:id/:page')
@UseGuards(AuthGuard('jwt'))
export class FetchPackagesByDeliverymanIdController {
  constructor(
    private fetchPackagesByDeliverymanIdUseCase: FetchPackagesByDeliverymanIdUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') id: string, @Param('page') page: string) {
    const result = await this.fetchPackagesByDeliverymanIdUseCase.execute({
      deliverymanId: id,
      page: Number(page),
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const packages = result.value.packages

    return { packages: packages.map(PackagePresenter.toHTTP) }
  }
}
