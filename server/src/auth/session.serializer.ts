import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService, UserPayload } from './auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(
    user: UserPayload,
    done: (err: Error | null, id: string) => void,
  ): void {
    done(null, user.id);
  }

  deserializeUser(
    id: string,
    done: (err: Error | null, user: UserPayload | null) => void,
  ): void {
    const user = this.authService.findById(id);
    done(null, user ?? null);
  }
}
