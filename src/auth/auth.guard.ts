import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

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
    request.user = user;
    return true;
  }
}
