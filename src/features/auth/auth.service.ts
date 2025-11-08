import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersService } from 'src/features/users/users.service';
import { NewUser } from 'db/schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async verifyFirebaseToken(idToken: string) {
    try {
      const auth = this.firebaseService.getAuth();
      const decoded = await auth.verifyIdToken(idToken);
      return decoded;
    } catch (err) {
      throw new UnauthorizedException('Invalid Firebase token');
    }
  }

  async registerWithFirebase(decodedToken: any) {
    const { uid, email, name, picture } = decodedToken;

    // Check if user already exists in DB
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) return existingUser;

    const newUser: NewUser = {
      first_name: name?.split(' ')[0] || 'User',
      last_name: name?.split(' ')[1] || '',
      email,
      username: email.split('@')[0],
      password_hash: '',
      phone_number: '',
      email_verified: true,
      role: 'CONSUMER',
      profile_picture_url: picture || '',
    };

    return this.usersService.createUser(newUser);
  }
}
