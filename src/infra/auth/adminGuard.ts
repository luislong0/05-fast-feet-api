import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common'
import { PrismaService } from '../database/prisma/prisma.service'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      return false
    }

    const userId = user.sub
    const isAdmin = await this.prismaService.isAdmin(userId)

    if (!isAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso.',
      )
    }

    return true
  }
}
