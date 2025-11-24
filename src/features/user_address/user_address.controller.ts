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
} from '@nestjs/common';
import { UserAddressService } from './user_address.service';
import { FirebaseAuthGuard } from '../auth/guard/firebase-auth-guard';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';

@Controller('user-address')
@UseGuards(FirebaseAuthGuard)
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Post()
  async createAddress(@Body() dto: CreateUserAddressDto) {
    return this.userAddressService.create(dto);
  }

  @Get()
  async getAllAddresses() {
    return this.userAddressService.findAll();
  }

  @Get()
  async getMyAddresses() {
    return this.userAddressService.findMyAddresses();
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
