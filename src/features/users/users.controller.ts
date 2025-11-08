import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth-guard';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.findAll();
  }

  @Get("Me")
  async getMe(@Req() req){
    const user = req.user;

    return user;
  }

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return this.usersService.findById(Number(id));
  }
}
