import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseInterceptors, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/users.entity';
import { CreateUserDto, PaginationUserDto, UpdateUserDto } from './dto/users.dto';
import { Roles } from './decorator/roles.decorator';
import * as slugid from 'slugid';
import { SlugIdInterceptor } from 'src/interceptors/slugid.interceptor';
import { IdPipe, SlugIdPipe } from './pipe/id.pipe';

@ApiTags('users')
@Controller('users')
@UseInterceptors(SlugIdInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @Post()
  @ApiCreatedResponse({
    description: 'create user',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const res = this.userService.create(createUserDto);
    return res;
  }

  @Get('/me')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiCreatedResponse({
    description: 'Get current user account information'
  })
  @ApiBearerAuth('JWT')
  async getMe(@Req() req) {
    const user = req.user
    const me = this.userService.getUserById(slugid.decode(user.id))
    return me
  }

  @Patch('/me')
  @Roles(UserRole.USER, UserRole.ADMIN)
  @ApiCreatedResponse({
    description: 'update user',
    type: UpdateUserDto,
  })
  @ApiBearerAuth('JWT')
  async userUpdate(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    const user = req.user
    console.log(user)
    const res = await this.userService.update(slugid.decode(user.id), updateUserDto);
    return res;
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({
    description: 'get all users',
    type: User,
  })
  @ApiBearerAuth('JWT')
  async findAll(@Query() query: PaginationUserDto): Promise<User[]> {
    const users = this.userService.findAll(query);
    return users;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(SlugIdPipe)
  @ApiCreatedResponse({
    description: 'get user by user id',
    type: User,
  })
  @ApiBearerAuth('JWT')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.userService.getUserById(id);
    return user;
  }

  @Get(':username')
  @Roles(UserRole.ADMIN)
  @ApiCreatedResponse({
    description: 'get user by user name',
    type: User,
  })
  @ApiBearerAuth('JWT')
  async getUserByUserName(
    @Param('username') username: string,
  ): Promise<User> | null {
    const user = await this.userService.getUserByUserName(username);
    return user;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(SlugIdPipe)
  @ApiCreatedResponse({
    description: 'update user by user id',
    type: UpdateUserDto,
  })
  @ApiBearerAuth('JWT')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    console.log("admin update", id, updateUserDto)
    const user = await this.userService.update(id, updateUserDto);
    return user;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(SlugIdPipe)
  @ApiBearerAuth('JWT')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
