import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('firebase-login')
  async firebaseLogin(@Body('idToken') idToken: string) {
    const decodedToken = await this.authService.verifyFirebaseToken(idToken);
    const user = await this.authService.registerWithFirebase(decodedToken);
    return { message: 'Authenticated successfully', user };
  }
}
