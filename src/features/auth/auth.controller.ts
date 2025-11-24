import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseService } from '../firebase/firebase.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @ApiOperation({
    summary:
      'Adds firebase user to DB if not yet added. Otherwise, return existing user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idToken: { type: 'string', example: 'abcd' },
      },
    },
  })
  @Post('google')
  async googleAuth(@Body('idToken') idToken: string) {
    return this.authService.loginOrRegister(idToken);
  }
}
