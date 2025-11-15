import { Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { UsersService } from 'src/features/users/users.service';
import { CartsService } from '../carts/carts.service';
import { NewCart, NewUser } from 'db/schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly firebaseService: FirebaseService,
    private readonly cartsService: CartsService,
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

    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) return existingUser;

    const provider = firebase?.sign_in_provider || 'unknown';
    const [firstName = 'User', ...rest] = name ? name.split(' ') : [];
    const lastName = rest.join(' ') || '';

    const newUser: NewUser = {
      firebase_uid: uid,
      first_name: firstName,
      last_name: lastName,
      email,
      username: email.split('@')[0],
      password_hash: null,
      phone_number: null,
      email_verified: !!decodedToken.email_verified,
      role: 'CONSUMER',
      profile_picture_url: picture || '',
    };

    const registeredUser = await this.usersService.createUser(newUser);

    try {
      await this.cartsService.createCart(uid);
    } catch (e) {
      console.error('Failed to create cart for user', uid, e);
    }

    return registeredUser;
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
