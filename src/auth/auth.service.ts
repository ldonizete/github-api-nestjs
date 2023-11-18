import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {constructor(private usersService: UsersService,private jwtService: JwtService) {}

async signIn(email: string, pass: string): Promise<any> {
  const user1 = await this.usersService.findOneByEmail(email);
  if (user1?.password !== pass) {
    throw new UnauthorizedException();
  }
  const payload = { sub: user1.id, username: user1.userTag };
  const token = await this.jwtService.signAsync(payload);
  const user = { ...user1, token };

    return {
      user
    };
}}
