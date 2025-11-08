import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from 'src/features/firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('Missing Firebase token');

    try {
      const decoded = await this.firebaseService.getAuth().verifyIdToken(token);
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(req: any): string | null {
    const header = req.headers.authorization;
    if (!header) return null;

    const [type, token] = header.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
