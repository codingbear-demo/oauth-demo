import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import type { Profile } from 'passport-google-oauth20';

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'google-123',
    displayName: 'Test User',
    emails: [{ value: 'test@example.com', verified: 'true' }],
    provider: 'google',
    photos: [],
    name: { familyName: 'User', givenName: 'Test' },
    profileUrl: '',
    _raw: '',
    _json: {} as any,
    ...overrides,
  } as Profile;
}

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('findOrCreate()', () => {
    it('should create a new user from Google profile', () => {
      const profile = makeProfile();
      const user = service.findOrCreate(profile);

      expect(user).toEqual({
        id: 'google-123',
        name: 'Test User',
        email: 'test@example.com',
        provider: 'google',
      });
    });

    it('should return the same object on repeated calls with the same profile', () => {
      const profile = makeProfile();
      const first = service.findOrCreate(profile);
      const second = service.findOrCreate(profile);

      expect(first).toBe(second);
    });
  });

  describe('findById()', () => {
    it('should return the user for an existing id', () => {
      const profile = makeProfile();
      service.findOrCreate(profile);

      const found = service.findById('google-123');
      expect(found).toBeDefined();
      expect(found?.email).toBe('test@example.com');
    });

    it('should return undefined for an unknown id', () => {
      const found = service.findById('nonexistent-id');
      expect(found).toBeUndefined();
    });
  });
});
