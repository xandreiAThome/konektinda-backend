import { Injectable } from '@nestjs/common';

interface User {
  uid: string;
  email: string;
  name?: string;
  photoUrl?: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  async findByUid(uid: string): Promise<User | undefined> {
    return this.users.find((u) => u.uid === uid);
  }

  async create(userData: User): Promise<User> {
    this.users.push(userData);
    return userData;
  }
}
