import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { StorageModule } from '../storage/storage.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUserUseCase } from '@/domain/carrier/application/use-cases/authenticate-user'
import { CreateDeliverymanUseCase } from '@/domain/carrier/application/use-cases/create-deliveryman'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'
import { GetDeliverymanController } from './controllers/get-deliveryman.controller'
import { GetDeliveryManInfoUseCase } from '@/domain/carrier/application/use-cases/get-deliveryman-info'
import { EditDeliverymanUseCase } from '@/domain/carrier/application/use-cases/edit-deliveryman'
import { EditDeliverymanController } from './controllers/edit-deliveryman.controller'
import { DeleteDeliverymanController } from './controllers/delete-deliveryman.controller'
import { DeleteDeliverymanUseCase } from '@/domain/carrier/application/use-cases/delete-deliveryman'
import { CreatePackageController } from './controllers/create-package.controller'
import { CreatePackageUseCase } from '@/domain/carrier/application/use-cases/create-package'
import { GetPackageController } from './controllers/get-package.controller'
import { GetPackageUseCase } from '@/domain/carrier/application/use-cases/get-package'
import { EditPackageController } from './controllers/edit-package.controller'
import { EditPackageUseCase } from '@/domain/carrier/application/use-cases/edit-package'
import { DeletePackageController } from './controllers/delete-package.controller'
import { DeletePackageUseCase } from '@/domain/carrier/application/use-cases/delete-package'
import { CreateRecipientController } from './controllers/create-recipient.controller'
import { CreateRecipientUseCase } from '@/domain/carrier/application/use-cases/create-recipient'
import { GetRecipientController } from './controllers/get-recipient.controller'
import { GetRecipientUseCase } from '@/domain/carrier/application/use-cases/get-recipient'
import { EditRecipientController } from './controllers/edit-recipient.controller'
import { EditRecipientUseCase } from '@/domain/carrier/application/use-cases/edit-recipient'
import { DeleteRecipientController } from './controllers/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/carrier/application/use-cases/delete-recipient'
import { PostPackageController } from './controllers/post-package.controller'
import { PostPackageUseCase } from '@/domain/carrier/application/use-cases/post-package'
import { WithdrawPackageController } from './controllers/withdraw-package.controller'
import { WithdrawPackageUseCase } from '@/domain/carrier/application/use-cases/withdraw-package'
import { UploadAndDeliveryPackageController } from './controllers/upload-and-delivery-package.controller'
import { UploadAndDeliveryPackageUseCase } from '@/domain/carrier/application/use-cases/upload-and-delivery-package'
import { ReturnPackageController } from './controllers/return-package.controller'
import { ReturnPackageUseCase } from '@/domain/carrier/application/use-cases/return-package'
import { FetchNearbyPackagesController } from './controllers/fetch-nearby-packages.controller'
import { FetchNearbyPackagesUseCase } from '@/domain/carrier/application/use-cases/fetch-nearby-packages'
import { ChangeUserPasswordController } from './controllers/change-user-password.controller'
import { ChangeUserPasswordUseCase } from '@/domain/carrier/application/use-cases/change-user-password'
import { FetchPackagesByDeliverymanIdController } from './controllers/fetch-packages-by-deliverymanId.controller'
import { FetchPackagesByDeliverymanIdUseCase } from '@/domain/carrier/application/use-cases/fetch-packages-by-deliverymanId'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    AuthenticateController,
    CreateDeliverymanController,
    GetDeliverymanController,
    EditDeliverymanController,
    DeleteDeliverymanController,
    CreatePackageController,
    GetPackageController,
    EditPackageController,
    DeletePackageController,
    CreateRecipientController,
    GetRecipientController,
    EditRecipientController,
    DeleteRecipientController,
    PostPackageController,
    WithdrawPackageController,
    UploadAndDeliveryPackageController,
    ReturnPackageController,
    FetchNearbyPackagesController,
    ChangeUserPasswordController,
    FetchPackagesByDeliverymanIdController,
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateDeliverymanUseCase,
    GetDeliveryManInfoUseCase,
    EditDeliverymanUseCase,
    DeleteDeliverymanUseCase,
    CreatePackageUseCase,
    GetPackageUseCase,
    EditPackageUseCase,
    DeletePackageUseCase,
    CreateRecipientUseCase,
    GetRecipientUseCase,
    EditRecipientUseCase,
    DeleteRecipientUseCase,
    PostPackageUseCase,
    WithdrawPackageUseCase,
    UploadAndDeliveryPackageUseCase,
    ReturnPackageUseCase,
    FetchNearbyPackagesUseCase,
    ChangeUserPasswordUseCase,
    FetchPackagesByDeliverymanIdUseCase,
  ],
})
export class HttpModule {}
