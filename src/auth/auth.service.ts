import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequest } from './dto/create-auth.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload: JwtPayload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!bcrypt.compareSync(password, user.password_hash)) {
      throw new UnauthorizedException('Wrong password');
    }
    return user;
  }
}
