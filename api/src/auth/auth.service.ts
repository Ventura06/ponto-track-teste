import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string; first_name: string }> {
    const user: User = await this.usersService.findByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    try {
      const token = await this.jwtService.signAsync(payload);
      await this.usersService.updateToken(token, user.id);
      return { access_token: token, first_name: user.first_name };
    } catch (error) {
      console.error('Error generating token:', error);
      throw new UnauthorizedException();
    }
  }

  async signOut(currentToken: string) {
    try {
      await this.usersService.removeToken(currentToken);
      return { message: 'Logout successful' };
    } catch (error) {
      console.error('Error logging out:', error);
      throw new UnauthorizedException();
    }
  }
}
