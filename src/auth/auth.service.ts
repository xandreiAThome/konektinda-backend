import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  async verifyToken(idToken: string) {
    try {
      const decodedToken = await this.firebaseService
        .getAuth()
        .verifyIdToken(idToken);

      const { uid, email, name, picture } = decodedToken;

      let user = await this.usersService.findByUid(uid);
      if (!user) {
        user = await this.usersService.create({
          uid,
          email,
          name,
          photoUrl: picture,
        });
      }

      return { message: 'Authenticated successfully', user };
    } catch (error) {
      console.error('AuthService.verifyToken Error:', error);
      throw new UnauthorizedException('Invalid Firebase ID token');
    }
  }
}
