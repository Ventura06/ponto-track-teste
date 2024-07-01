import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByCurrentToken: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
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

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        first_name: 'User name',
        last_name: 'User last name',
        email: 'email@email.com',
        password: 'password',
      };
      const result = {
        ...createUserDto,
        ulid: 'ulid',
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(result);

      expect(await usersController.create(createUserDto)).toBe(result);
      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findByCurrentToken', () => {
    it('should return the user data by access token', async () => {
      const request = {
        headers: {
          authorization: 'Bearer token',
        },
      } as Request;
      const result = {
        ulid: 'ulid',
        email: 'email',
        first_name: 'first_name',
        last_name: 'last_name',
      };

      jest.spyOn(usersService, 'findByCurrentToken').mockResolvedValue(result);

      expect(await usersController.findByCurrentToken(request)).toBe(result);
      expect(usersService.findByCurrentToken).toHaveBeenCalledWith('token');
    });
  });

  describe('update', () => {
    it('should update the user data', async () => {
      const request = {
        headers: {
          authorization: 'Bearer token',
        },
      } as Request;
      const updateUserDto: UpdateUserDto = {
        first_name: 'User name',
        last_name: 'User last name',
        email: 'email@email.com',
      };

      jest.spyOn(usersService, 'update').mockResolvedValue();

      expect(await usersController.update(request, updateUserDto)).toBe(
        undefined,
      );
      expect(usersService.update).toHaveBeenCalledWith('token', updateUserDto);
    });
  });

  describe('delete', () => {
    it('should delete the user', async () => {
      const request = {
        headers: {
          authorization: 'Bearer token',
        },
      } as Request;

      jest.spyOn(usersService, 'delete').mockResolvedValue();

      expect(await usersController.delete(request)).toBe(undefined);
      expect(usersService.delete).toHaveBeenCalledWith('token');
    });
  });
});
