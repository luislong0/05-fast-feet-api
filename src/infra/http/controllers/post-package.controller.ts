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
import { PostPackageUseCase } from '@/domain/carrier/application/use-cases/post-package'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

@Controller('/packages/post/:id')
@UseGuards(AuthGuard('jwt'))
export class PostPackageController {
  constructor(private postPackageUseCase: PostPackageUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    const result = await this.postPackageUseCase.execute({
      deliverymanId: user.sub,
      packageId: id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
