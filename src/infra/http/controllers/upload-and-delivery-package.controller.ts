/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadAndDeliveryPackageUseCase } from '@/domain/carrier/application/use-cases/upload-and-delivery-package'

@Controller('/packages/upload-and-delivery/:packageId/:status')
@UseGuards(AuthGuard('jwt'))
export class UploadAndDeliveryPackageController {
  constructor(
    private uploadAndDeliveryPackageUseCase: UploadAndDeliveryPackageUseCase,
  ) {}

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }), // 2mb
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('packageId') packageId: string,
    @Param('status') packageStatus: string,
  ) {
    const result = await this.uploadAndDeliveryPackageUseCase.execute({
      body: file.buffer,
      deliverymanId: user.sub,
      fileName: file.originalname,
      fileType: file.mimetype,
      packageId,
      packageStatus,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
