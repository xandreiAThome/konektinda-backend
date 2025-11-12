import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/guard/firebase-auth-guard';
import { UpdateUserDto } from './dto/updateuser.dto';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('Me')
  async getMe(@Req() req) {
    const user = req.user;

    return user;
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  @Patch(':id')
  async updateUserById(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(Number(id), dto);
  }

  @Delete(':id')
  async deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }
}
