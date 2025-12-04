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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserAddressService } from './user_address.service';
import { FirebaseAuthGuard } from '../auth/guard/firebase-auth-guard';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import type { AuthenticatedRequest } from 'interface/auth_req';
import { UsersService } from '../users/users.service';

@ApiTags('user-address')
@ApiBearerAuth()
@Controller('user-address')
@UseGuards(FirebaseAuthGuard)
export class UserAddressController {
  constructor(
    private readonly userAddressService: UserAddressService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new address',
    description:
      'Creates a new address for a user. Provide user_id, region (e.g., NCR), province (e.g., Metro Manila), city (e.g., Makati City), barangay (e.g., Bel-Air), and zip_code (e.g., 1121).',
  })
  @ApiBody({
    type: CreateUserAddressDto,
    examples: {
      example1: {
        summary: 'Sample Address',
        value: {
          user_id: 1,
          region: 'NCR',
          province: 'Metro Manila',
          city: 'Makati City',
          barangay: 'Bel-Air',
          zip_code: '1121',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Address successfully created',
    schema: {
      example: {
        address_id: 1,
        user_id: 1,
        region: 'NCR',
        province: 'Metro Manila',
        city: 'Makati City',
        barangay: 'Bel-Air',
        zip_code: '1121',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input data - Ensure all required fields are provided: user_id (number), region (string), province (string), city (string), barangay (string), zip_code (string). Do not include extra fields.',
    schema: {
      example: {
        message: [
          'user_id must be an integer number',
          'user_id should not be empty',
          'region must be a string',
          'region should not be empty',
        ],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized - You must provide a valid Firebase Bearer token in the Authorization header',
    schema: {
      example: {
        message: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      'Foreign key constraint violation - The user_id does not exist in the users table. Make sure to use a valid user_id from an existing user.',
    schema: {
      example: {
        message:
          'insert or update on table "user_addresses" violates foreign key constraint',
        statusCode: 500,
      },
    },
  })
  async createAddress(@Body() dto: CreateUserAddressDto) {
    return this.userAddressService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all addresses',
    description: 'Retrieves all user addresses with user relations',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all addresses',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  async getAllAddresses() {
    return this.userAddressService.findAll();
  }

  @Get('me')
  @ApiOperation({
    summary: 'Get my addresses',
    description: 'Retrieves all addresses for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user addresses',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getMyAddresses(@Req() req: AuthenticatedRequest) {
    const uid = req.user.uid;
    const user = await this.usersService.findById(uid);
    if (!user) {
      throw new Error('User not found');
    }
    return this.userAddressService.findMyAddresses(user.user_id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get an address by ID',
    description: 'Retrieves a specific address by its ID with user relations',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Address ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the address',
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  async getAddressById(@Param('id', ParseIntPipe) id: number) {
    return this.userAddressService.findById(id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get addresses by user ID',
    description: 'Retrieves all addresses for a specific user',
  })
  @ApiParam({
    name: 'userId',
    type: Number,
    description: 'User ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user addresses',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid user ID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  async getAddressesByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.userAddressService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an address',
    description: 'Updates an existing address by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Address ID',
    example: 1,
  })
  @ApiBody({ type: UpdateUserAddressDto })
  @ApiResponse({
    status: 200,
    description: 'Address successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or ID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  async updateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserAddressDto,
  ) {
    return this.userAddressService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an address',
    description: 'Deletes an address by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Address ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Address successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Address not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  async deleteAddress(@Param('id', ParseIntPipe) id: number) {
    return this.userAddressService.delete(id);
  }
}
