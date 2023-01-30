import { SetMetadata } from '@nestjs/common';
import { Role as PRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: PRole[]) => SetMetadata(ROLES_KEY, roles);
