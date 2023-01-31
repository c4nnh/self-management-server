import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { PrismaService } from '../db/prisma.service';
import { UserEntity } from '../users/entities/user.entity';
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
      },
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
        password: true,
        role: true,
      },
    });

    return {
      user: user,
      token: this.genToken(user),
    };
  }

  async me(userPayload: TokenPayload): Promise<MeResponse> {
    const { id } = userPayload;

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        currency: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User does not exist');

    return user;
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
