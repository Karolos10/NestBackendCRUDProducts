import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client'

@Injectable()
export class ProductsService {

  constructor(private prismaService: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prismaService.product.create({
        data: createProductDto
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ConflictException(`Product with name ${createProductDto.name} already exists`);
        }
      }
    }
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findOne(id: number) {
    const productFound = await this.prismaService.product.findUnique({
      where: {
        id: id
      }
    });

    if (!productFound) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return productFound;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.prismaService.product.update({
      where: {
        id: id
      },
      data: updateProductDto
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return updatedProduct;
  }

  async remove(id: number) {
    const deleteProduct = await this.prismaService.product.delete({
      where: {
        id: id
      }
    });

    if (!deleteProduct) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return deleteProduct;
  }
}
