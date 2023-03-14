import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { createHash } from 'crypto';
import { CURRENCY_MASTER_DATA_SELECT, EVENT_EMITTER } from 'src/utils';
import { PrismaService } from '../db/prisma.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { Token, TokenPayload } from './entities/token.entity';
import {
  LoginResponse,
  MeResponse,
  ResgisterResponse,
} from './response/auth.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly uersService: UsersService,
    private readonly eventEmitter2: EventEmitter2,
  ) {}

  async register(dto: RegisterDto): Promise<ResgisterResponse> {
    const checkEmail = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (checkEmail) throw new ConflictException('This email has been exist!');

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: this.hashPassword(dto.password),
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        currency: {
          select: CURRENCY_MASTER_DATA_SELECT,
        },
      },
    });

    this.eventEmitter2.emit(EVENT_EMITTER.CREATE_USER, {
      id: user.id,
      email: dto.email,
      name: dto.name,
    });

    return {
      user: user,
      token: this.genToken(user),
    };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        password: true,
        role: true,
        currency: {
          select: CURRENCY_MASTER_DATA_SELECT,
        },
      },
    });

    if (!user) throw new NotFoundException('Your account does not exist');

    const { password, ...restUser } = user;

    const hashPass = this.hashPassword(dto.password);
    if (hashPass !== password)
      throw new UnauthorizedException('Password is incorrect');

    return {
      user: restUser,
      token: this.genToken(user),
    };
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const token: TokenPayload = this.verifyToken(refreshToken);

    const user = await this.prisma.user.findFirst({
      where: {
        id: token.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        currency: {
          select: CURRENCY_MASTER_DATA_SELECT,
        },
      },
    });

    return {
      user: user,
      token: this.genToken(user),
    };
  }

  async me(userPayload: TokenPayload): Promise<MeResponse> {
    const { id } = userPayload;

    return this.uersService.checkExist(id);
  }

  private genToken(dto: Pick<UserEntity, 'id' | 'role'>): Token {
    const { id, role } = dto;

    return {
      accessToken: this.jwtService.sign({ id, role }),
      refreshToken: this.jwtService.sign(
        {
          id,
          role,
        },
        {
          expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRED'),
        },
      ),
    };
  }

  private hashPassword(pass: string): string {
    const firstHash = createHash('md5').update(pass).digest('hex');
    return createHash('md5').update(firstHash).digest('hex');
  }

  verifyToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Refresh token is expired');
    }
  }
}
