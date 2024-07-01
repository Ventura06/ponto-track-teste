import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import * as ulid from 'ulid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a user and return the user data', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
      };

      const mockUlid = '01J1FMFHFZFMDN5ENJ16Z6VJG2';
      const mockHashedPassword =
        '$2b$10$s3.1twxMeq804BnM4inAXuM2aNS4hKsuUyJZDt9nLnIAPwH88iJTm';
      const expectedUser: Partial<User> = {
        ulid: mockUlid,
        email: createUserDto.email,
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
      };

      jest.spyOn(ulid, 'ulid').mockReturnValue(mockUlid);
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(mockHashedPassword);

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([expectedUser]);

      const result = await service.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(userRepository.query).toHaveBeenCalledWith(
        `INSERT INTO t_user (ulid,email, password, first_name, last_name, current_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ulid, email, first_name, last_name`,
        [
          mockUlid,
          createUserDto.email,
          mockHashedPassword,
          createUserDto.first_name,
          createUserDto.last_name,
          '',
        ],
      );
    });
  });

  describe('findByEmail', () => {
    it('should return the user by email', async () => {
      const email = 'test@example.com';
      const expectedUser = {
        ulid: ulid.ulid(),
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
      };

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([expectedUser]);

      const result = await service.findByEmail(email);

      expect(result).toEqual(expectedUser);
      expect(userRepository.query).toHaveBeenCalledWith(
        `SELECT * FROM t_user WHERE email = $1`,
        [email],
      );
    });

    it('should return null if the user is not found', async () => {
      const email = 'notfound@example.com';

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([]);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
      expect(userRepository.query).toHaveBeenCalledWith(
        `SELECT * FROM t_user WHERE email = $1`,
        [email],
      );
    });
  });

  describe('findByCurrentToken', () => {
    it('should return the user by current token', async () => {
      const currentToken = 'token123';
      const user = {
        ulid: ulid.ulid(),
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        current_token: currentToken,
      };
      const expectedUser = {
        ulid: user.ulid,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      };

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([user]);

      const result = await service.findByCurrentToken(currentToken);

      expect(result).toEqual(expectedUser);
      expect(userRepository.query).toHaveBeenCalledWith(
        `SELECT * FROM t_user WHERE current_token = $1`,
        [currentToken],
      );
    });

    it('should throw an error if the user is not found', async () => {
      const currentToken = 'token123';

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([]);

      await expect(service.findByCurrentToken(currentToken)).rejects.toThrow(
        'User not found',
      );
      expect(userRepository.query).toHaveBeenCalledWith(
        `SELECT * FROM t_user WHERE current_token = $1`,
        [currentToken],
      );
    });
  });

  describe('update', () => {
    it('should update the user data', async () => {
      const currentToken = 'token123';
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'User',
      };
      const user = {
        password: 'hashedpassword',
      };

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([user]);

      await service.update(currentToken, updateUserDto);

      expect(userRepository.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE t_user SET'),
        expect.arrayContaining([
          updateUserDto.email,
          updateUserDto.first_name,
          updateUserDto.last_name,
          currentToken,
        ]),
      );
    });

    it('should throw an error if current password is required but not provided', async () => {
      const currentToken = 'token123';
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'User',
        new_password: 'newpassword123',
      };

      const result = {
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'User',
        new_password: 'newpassword123',
      };

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([result]);
      await expect(service.update(currentToken, updateUserDto)).rejects.toThrow(
        'Current password is required',
      );
    });

    it('should throw an error if current password is incorrect', async () => {
      const currentToken = 'token123';
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'User',
        new_password: 'newpassword123',
        current_password: 'wrongpassword',
      };
      const user = {
        password: 'hashedpassword',
      };

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([user]);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false);

      await expect(service.update(currentToken, updateUserDto)).rejects.toThrow(
        'Current password is incorrect',
      );
    });
  });

  describe('delete', () => {
    it('should delete the user', async () => {
      const currentToken = 'token123';
      const user = {
        id: 1,
      };

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([user]);

      await service.delete(currentToken);

      expect(userRepository.query).toHaveBeenCalledWith(
        `DELETE FROM t_user WHERE id = $1`,
        [user.id],
      );
    });

    it('should throw an error if the user is not found', async () => {
      const currentToken = 'token123';

      jest.spyOn(userRepository, 'query').mockResolvedValueOnce([]);

      await expect(service.delete(currentToken)).rejects.toThrow(
        'User not found',
      );
    });
  });
});
