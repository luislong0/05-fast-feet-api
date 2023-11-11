/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ReturnPackageUseCase } from '@/domain/carrier/application/use-cases/return-package'

@Controller('/packages/return/:id')
@UseGuards(AuthGuard('jwt'))
export class ReturnPackageController {
  constructor(private returnPackageUseCase: ReturnPackageUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(@Param('id') id: string) {
    const result = await this.returnPackageUseCase.execute({
      packageId: id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
