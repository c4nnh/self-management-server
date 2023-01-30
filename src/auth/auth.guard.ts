import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader: string = request.headers.authorization;
    if (!authHeader) return false;
    const match = authHeader.match(/^Bearer (?<token>.+)$/);
    if (!match || !match.groups.token) return false;
    const user = this.authService.verifyToken(match.groups.token);
    if (!user) return false;

    const roles =
      this.reflector.get<string[]>(ROLES_KEY, context.getHandler()) || [];

    if (!roles.length) return true;

    if (user.role !== Role.ADMIN && !roles.some((r) => r === user.role))
      throw new ForbiddenException('You have no permission');

    request.user = user;
    return true;
  }
}
