import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, PaginationUserDto, UpdateUserDto } from './dto/users.dto';
import { User } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        public userRepository: Repository<User>,
        private dataSource: DataSource,
    ) { }

    async verifyPassword(password: string, dbPassword: string): Promise<boolean> {
        const isPasswordMatch = await bcrypt.compare(password, dbPassword);
        if (!isPasswordMatch) {
            throw new UnauthorizedException;
        }
        return isPasswordMatch;
    }

    async checkUserAlreadyExists(createUserDto: CreateUserDto): Promise<boolean> {
        var user: User;
        try {
            if (createUserDto.username) {
                user = await this.getUserByUserName(createUserDto.username);
            }
            if (!user && createUserDto.email) {
                user = await this.getUserByEmail(createUserDto.email);
            }
        } catch (error) {
            ;
        }
        if (user === undefined) {
            return false;
        }
        return true;
    }

    async hashPassword(password: string): Promise<string> {
        const hashPassword = await bcrypt.hash(password, await bcrypt.genSalt());
        return hashPassword;
    }
    async create(createUserDto: CreateUserDto): Promise<User> {
        if (await this.checkUserAlreadyExists(createUserDto)) {
            throw new HttpException('Username or Email already exists', HttpStatus.CONFLICT);
        }
        const user: User = new User({
            username: createUserDto.username,
            email: createUserDto.email,
            password: await this.hashPassword(createUserDto.password),
            role: createUserDto.role,
        });
        this.dataSource.getRepository(User).save(user);
        return user;
    }

    async findAll(query: PaginationUserDto): Promise<User[]> {
        const { page, pageSize } = query
        const skip = (page - 1) * pageSize
        const users = await this.userRepository.find({
            take: pageSize,
            skip: skip
        });
        return users;
    }

    async getUserByUserName(username: string): Promise<User> | null {
        const user = await this.userRepository.findOneBy({ username });
        if (!user)
            throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
        return user;
    }

    async getUserById(id: string): Promise<User> | null {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
        return user;
    }

    async getUserByEmail(email: string): Promise<User> | null {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user)
            throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
        return user;
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<User> {
        console.log("update", updateUserDto)
        const user: User = await this.userRepository.findOne({ where: { id } });
        if (!user)
            throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
        try {
            updateUserDto.password = await this.hashPassword(updateUserDto.password);
        } catch (error) {
            ;
        }
        const updated = Object.assign(user, updateUserDto);
        console.log("update", updated)
        return this.userRepository.save(updated);
    }

    async remove(id: string): Promise<{ affected?: number }> {
        return this.userRepository.delete(id);
    }

}
