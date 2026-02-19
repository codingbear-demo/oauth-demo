import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { AuthService } from './auth.service';
import type { Profile } from 'passport-google-oauth20';

function makeProfile(): Profile {
  return {
    id: 'google-456',
    displayName: 'Strategy User',
    emails: [{ value: 'strategy@example.com', verified: 'true' }],
    provider: 'google',
    photos: [],
    name: { familyName: 'User', givenName: 'Strategy' },
    profileUrl: '',
    _raw: '',
    _json: {} as any,
  } as Profile;
}

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
        {
          provide: AuthService,
          useValue: {
            findOrCreate: jest.fn().mockReturnValue({
              id: 'google-456',
              name: 'Strategy User',
              email: 'strategy@example.com',
              provider: 'google',
            }),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const map: Record<string, string> = {
                'app.google.clientId': 'test-client-id',
                'app.google.clientSecret': 'test-client-secret',
                'app.google.callbackUrl': 'http://localhost:3000/auth/google/callback',
              };
              return map[key];
            }),
          },
        },
      ],
    }).compile();

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  describe('validate()', () => {
    it('should call authService.findOrCreate with the profile', async () => {
      const profile = makeProfile();
      await strategy.validate('access-token', 'refresh-token', profile);

      expect(authService.findOrCreate).toHaveBeenCalledWith(profile);
    });

    it('should NOT forward accessToken or refreshToken to authService', async () => {
      const profile = makeProfile();
      const spy = jest.spyOn(authService, 'findOrCreate');

      await strategy.validate('should-not-pass', 'also-not-pass', profile);

      // findOrCreate is called with only the profile, not tokens
      expect(spy).toHaveBeenCalledWith(profile);
      expect(spy).toHaveBeenCalledTimes(1);
      const callArgs = spy.mock.calls[0];
      expect(callArgs).toHaveLength(1);
    });
  });
});
