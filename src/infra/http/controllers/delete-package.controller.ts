/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AdminGuard } from '@/infra/auth/adminGuard'
import { DeletePackageUseCase } from '@/domain/carrier/application/use-cases/delete-package'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/packages/:id')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class DeletePackageController {
  constructor(private deletePackageUseCase: DeletePackageUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    const result = await this.deletePackageUseCase.execute({
      packageId: id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
