import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            signOut: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return access token when sign in is successful', async () => {
      const signInDto: SignInDto = {
        email: 'test@test.com',
        password: 'testpass',
      };
      const result = { access_token: 'token', first_name: 'User name' };
      jest.spyOn(authService, 'signIn').mockResolvedValue(result);

      expect(await authController.signIn(signInDto)).toBe(result);
      expect(authService.signIn).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
    });
  });

  describe('signOut', () => {
    it('should return result when sign out is successful', async () => {
      const request = {
        headers: {
          authorization: 'Bearer token',
        },
      } as Request;
      const result = { message: 'Sign out successful' };
      jest.spyOn(authService, 'signOut').mockResolvedValue(result);

      expect(await authController.signOut(request)).toBe(result);
      expect(authService.signOut).toHaveBeenCalledWith('token');
    });
  });
});
