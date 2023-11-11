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
import { FetchNearbyPackagesUseCase } from '@/domain/carrier/application/use-cases/fetch-nearby-packages'
import { PackagePresenter } from '../presenters/package-presenter'

@Controller('/packages/:id/nearby/:page/:latitude/:longitude')
@UseGuards(AuthGuard('jwt'))
export class FetchNearbyPackagesController {
  constructor(private fetchNearbyPackagesUseCase: FetchNearbyPackagesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('id') id: string,
    @Param('page') page: string,
    @Param('latitude') latitude: string,
    @Param('longitude') longitude: string,
  ) {
    const result = await this.fetchNearbyPackagesUseCase.execute({
      deliverymanId: id,
      userLatitude: Number(latitude),
      userLongitude: Number(longitude),
      page: Number(page),
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const packages = result.value.packages

    return { packages: packages.map(PackagePresenter.toHTTP) }
  }
}
