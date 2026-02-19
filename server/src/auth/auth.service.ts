import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  provider: string;
}

@Injectable()
export class AuthService {
  private readonly users = new Map<string, UserPayload>();

  findOrCreate(profile: Profile): UserPayload {
    const existing = this.users.get(profile.id);
    if (existing) return existing;

    const user: UserPayload = {
      id: profile.id,
      name: profile.displayName,
      email: profile.emails?.[0]?.value ?? '',
      provider: profile.provider,
    };
    this.users.set(user.id, user);
    return user;
  }

  findById(id: string): UserPayload | undefined {
    return this.users.get(id);
  }
}
