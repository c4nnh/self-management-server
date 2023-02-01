import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { GetAssetsArgs } from './args/asset.args';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';
import { PaginationAssetResponse } from './response/asset.response';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  getMany = async (
    userId: string,
    args: GetAssetsArgs,
  ): Promise<PaginationAssetResponse> => {
    const { name, limit, offset, orderBy, orderDirection } = args;

    const where: Prisma.AssetWhereInput = {
      userId,
    };

    if (name) {
      where.name = {
        contains: name,
        mode: 'insensitive',
      };
    }

    const order: Prisma.AssetOrderByWithRelationInput = {};

    if (orderBy) {
      order[orderBy] = orderDirection || Prisma.SortOrder.asc;
    } else {
      order.createdAt = Prisma.SortOrder.desc;
    }

    const [totalItem, items] = await this.prisma.$transaction([
      this.prisma.asset.count({ where }),
      this.prisma.asset.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: order,
      }),
    ]);

    return {
      pagination: {
        limit,
        offset,
        totalItem,
      },
      items,
    };
  };

  create = async (userId: string, dto: CreateAssetDto) => {
    const existedName = await this.prisma.asset.findFirst({
      where: {
        name: dto.name,
        userId,
      },
    });
    if (existedName) {
      throw new ConflictException('You already have asset with same name');
    }

    return this.prisma.asset.create({
      data: {
        ...dto,
        userId,
      },
    });
  };

  update = async (userId: string, assetId: string, dto: UpdateAssetDto) => {
    const asset = await this.checkExist(assetId);

    if (asset.userId !== userId) {
      throw new ForbiddenException('This asset does not belong to you');
    }

    if (dto.name) {
      const existedName = await this.prisma.asset.findFirst({
        where: {
          userId,
          name: dto.name,
          id: {
            not: asset.id,
          },
        },
      });

      if (existedName) {
        throw new ConflictException('You already have asset with same name');
      }

      if (dto.images === undefined) {
        return asset;
      }
    }

    const deletedUrls = asset.images.filter(
      (item) => !dto.images.includes(item),
    );

    // TODO
    // delete unused images in gcp

    return this.prisma.asset.update({
      where: { id: assetId },
      data: dto,
    });
  };

  delete = async (userId: string, assetId: string) => {
    const asset = await this.checkExist(assetId);

    if (asset.userId !== userId) {
      throw new ForbiddenException('This asset does not belong to you');
    }

    // TODO
    // delete unused images in gcp

    await this.prisma.asset.delete({
      where: { id: assetId },
    });

    return true;
  };

  private checkExist = async (id: string) => {
    const asset = await this.prisma.asset.findUnique({ where: { id } });

    if (!asset) {
      throw new NotFoundException('This asset does not exist');
    }

    return asset;
  };
}
