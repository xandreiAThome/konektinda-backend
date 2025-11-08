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
    const { uid, email, name, picture, firebase } = decodedToken;

    // Check if user already exists in DB
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) return existingUser;

    // Extract provider info (google.com, facebook.com, password, etc.)
    const provider = firebase?.sign_in_provider || 'unknown';
    
    // Handle different name formats from different providers
    let firstName = 'User';
    let lastName = '';
    
    if (name) {
      const nameParts = name.split(' ');
      firstName = nameParts[0] || 'User';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    const newUser: NewUser = {
      first_name: firstName,
      last_name: lastName,
      email,
      username: email.split('@')[0],
      password_hash: '', // OAuth users don't need password
      phone_number: '',
      email_verified: decodedToken.email_verified || true,
      role: 'CONSUMER',
      profile_picture_url: picture || '',
    };

    return this.usersService.createUser(newUser);
  }

  async loginOrRegister(idToken: string) {
    const decodedToken = await this.verifyFirebaseToken(idToken);
    const user = await this.registerWithFirebase(decodedToken);
    
    return {
      message: 'Authenticated successfully',
      user,
      provider: decodedToken.firebase?.sign_in_provider || 'unknown',
    };
  }
}
