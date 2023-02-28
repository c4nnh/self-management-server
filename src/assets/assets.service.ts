import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Prisma } from '@prisma/client';
import { CurrenciesService } from 'src/currencies/currencies.service';
import { PrismaService } from '../db/prisma.service';
import { ASSET_DETAIL_SELECT, EVENT_EMITTER, IMAGE_FOLDER } from '../utils';
import { GetAssetsArgs } from './args/asset.args';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';
import { PaginationAssetResponse } from './response/asset.response';

@Injectable()
export class AssetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly currenciesService: CurrenciesService,
  ) {}

  getDetail = async (userId: string, id: string) => {
    const asset = await this.checkExist(id);
    if (asset.userId !== userId) {
      throw new ForbiddenException('This asset does not belong to you');
    }
    return asset;
  };

  getMany = async (
    userId: string,
    args: GetAssetsArgs,
  ): Promise<PaginationAssetResponse> => {
    const {
      search,
      boughtDateFrom,
      boughtDateTo,
      priceFrom,
      priceTo,
      limit,
      offset,
      orderBy,
      orderDirection,
    } = args;

    const where: Prisma.AssetWhereInput = {
      userId,
      boughtDate: {
        gte: boughtDateFrom,
        lte: boughtDateTo,
      },
      price: {
        gte: priceFrom,
      },
    };

    if (priceTo) {
      (where.price as Prisma.FloatFilter).lte = priceTo;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
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
        select: ASSET_DETAIL_SELECT,
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
    const asset = await this.getDetail(userId, assetId);

    if (dto.currencyId && dto.currencyId !== asset.currencyId) {
      await this.currenciesService.checkExist(dto.currencyId);
    }

    const deletedUrls = asset.images.filter(
      (item) => !dto.images.includes(item),
    );

    this.eventEmitter.emit(EVENT_EMITTER.DELETE_IMAGES, {
      urls: deletedUrls,
      folder: IMAGE_FOLDER.ASSET,
    });

    return this.prisma.asset.update({
      where: { id: assetId },
      data: dto,
    });
  };

  delete = async (userId: string, assetId: string) => {
    const asset = await this.getDetail(userId, assetId);

    this.eventEmitter.emit(EVENT_EMITTER.DELETE_IMAGES, {
      urls: asset.images || [],
      folder: IMAGE_FOLDER.ASSET,
    });

    await this.prisma.asset.delete({
      where: { id: assetId },
    });

    return true;
  };

  private checkExist = async (id: string) => {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        currency: true,
      },
    });
    if (!asset) {
      throw new NotFoundException('This asset does not exist');
    }
    return asset;
  };

  deleteMany = async (userId: string, assetIds: string[]) => {
    await this.prisma.asset.deleteMany({
      where: {
        userId,
        id: {
          in: assetIds,
        },
      },
    });

    return true;
  };
}
