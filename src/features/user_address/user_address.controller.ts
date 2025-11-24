import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { FirebaseAuthGuard } from '../auth/guard/firebase-auth-guard';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import type { AuthenticatedRequest } from 'interface/auth_req';
import { UsersService } from '../users/users.service';

@Controller('user-address')
@UseGuards(FirebaseAuthGuard)
export class UserAddressController {
  constructor(
    private readonly userAddressService: UserAddressService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createAddress(@Body() dto: CreateUserAddressDto) {
    return this.userAddressService.create(dto);
  }

  @Get()
  async getAllAddresses() {
    return this.userAddressService.findAll();
  }

  @Get('me')
  async getMyAddresses(@Req() req: AuthenticatedRequest) {
    const uid = req.user.uid;
    const user = await this.usersService.findById(uid);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userAddressService.findMyAddresses(user.user_id);
  }

  @Get(':id')
  async getAddressById(@Param('id', ParseIntPipe) id: number) {
    return this.userAddressService.findById(id);
  }

  @Get('user/:userId')
  async getAddressesByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.userAddressService.findByUserId(userId);
  }

  @Patch(':id')
  async updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserAddressDto,
  ) {
    return this.userAddressService.update(id, dto);
  }

  @Delete(':id')
  async deleteAddress(@Param('id', ParseIntPipe) id: number) {
    return this.userAddressService.delete(id);
  }
}
