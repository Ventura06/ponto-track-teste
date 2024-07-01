import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hashSync(createUserDto.password, 10);
    const user = (
      await this.userRepository.query(
        `INSERT INTO t_user (ulid,email, password, first_name, last_name, current_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ulid, email, first_name, last_name`,
        [
          ulid(),
          createUserDto.email,
          hashedPassword,
          createUserDto.first_name,
          createUserDto.last_name,
          '',
        ],
      )
    )[0];
    return user;
  }

  async findByEmail(email: string) {
    const user = (
      await this.userRepository.query(`SELECT * FROM t_user WHERE email = $1`, [
        email,
      ])
    )[0];

    if (!user) {
      return null;
    }

    return user;
  }

  async findByCurrentToken(current_token: string) {
    const user = (
      await this.userRepository.query(
        `SELECT * FROM t_user WHERE current_token = $1`,
        [current_token],
      )
    )[0];

    if (!user) {
      throw new Error('User not found');
    }

    const safeData = {
      ulid: user.ulid,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    return safeData;
  }

  async update(current_token: string, updateUserDto: UpdateUserDto) {
    const user = (
      await this.userRepository.query(
        `SELECT password FROM t_user WHERE current_token = $1`,
        [current_token],
      )
    )[0];
    const updateFields = {
      email: updateUserDto.email,
      first_name: updateUserDto.first_name,
      last_name: updateUserDto.last_name,
    };
    if (updateUserDto.new_password) {
      if (!updateUserDto.current_password)
        throw new Error('Current password is required');
      if (
        !(await bcrypt.compareSync(
          updateUserDto.current_password,
          user.password,
        ))
      )
        throw new Error('Current password is incorrect');

      const hashedPassword = await bcrypt.hash(updateUserDto.new_password, 10);
      updateFields['password'] = hashedPassword;
    }

    const setClause = Object.keys(updateFields)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');

    const values = Object.values(updateFields);
    values.push(current_token);

    await this.userRepository.query(
      `UPDATE t_user SET ${setClause} WHERE current_token = $${values.length}`,
      values,
    );

    return;
  }

  async updateToken(current_token: string, id: number) {
    return await this.userRepository.query(
      `UPDATE t_user SET current_token = $1 WHERE id = $2`,
      [current_token, id],
    );
  }

  async removeToken(current_token: string) {
    return await this.userRepository.query(
      `UPDATE t_user SET current_token = NULL WHERE current_token = $1`,
      [current_token],
    );
  }

  async delete(current_token: string) {
    const user = (
      await this.userRepository.query(
        `SELECT id FROM t_user WHERE current_token = $1`,
        [current_token],
      )
    )[0];

    if (!user) {
      throw new Error('User not found');
    }

    try {
      await this.userRepository.query(`DELETE FROM t_user WHERE id = $1`, [
        user.id,
      ]);
    } catch (error) {
      throw new Error(error);
    }
  }
}
