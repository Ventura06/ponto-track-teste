import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            updateToken: jest.fn(),
            removeToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return an access token and first name if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user: Partial<User> = {
        id: 1,
        email: email,
        password: bcrypt.hashSync(password, 10),
        first_name: 'Test',
        last_name: 'User',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');
      jest.spyOn(usersService, 'updateToken').mockResolvedValue(undefined);

      const result = await authService.signIn(email, password);

      expect(result).toEqual({ access_token: 'token', first_name: 'Test' });
      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
      });
      expect(usersService.updateToken).toHaveBeenCalledWith('token', user.id);
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(authService.signIn(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an UnauthorizedException if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user: Partial<User> = {
        id: 1,
        email: email,
        password: bcrypt.hashSync('wrongpassword', 10),
        first_name: 'Test',
        last_name: 'User',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);

      await expect(authService.signIn(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw an UnauthorizedException if there is an error generating the token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user: Partial<User> = {
        id: 1,
        email: email,
        password: bcrypt.hashSync(password, 10),
        first_name: 'Test',
        last_name: 'User',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockRejectedValue(new Error('Token error'));

      await expect(authService.signIn(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('signOut', () => {
    it('should return a success message if logout is successful', async () => {
      const token = 'token123';

      jest.spyOn(usersService, 'removeToken').mockResolvedValue(undefined);

      const result = await authService.signOut(token);

      expect(result).toEqual({ message: 'Logout successful' });
      expect(usersService.removeToken).toHaveBeenCalledWith(token);
    });

    it('should throw an UnauthorizedException if there is an error during logout', async () => {
      const token = 'token123';

      jest
        .spyOn(usersService, 'removeToken')
        .mockRejectedValue(new Error('Logout error'));

      await expect(authService.signOut(token)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
