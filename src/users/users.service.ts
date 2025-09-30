import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password_hash, ...userWithoutPassword } = createUserDto;

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    return this.prisma.users.create({
      data: { ...userWithoutPassword, password_hash: hashedPassword },
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const result = await this.prisma.users.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async findOneByUsername(username: string) {
    return this.prisma.users.findFirstOrThrow({
      where: { username },
    });
  }
}
