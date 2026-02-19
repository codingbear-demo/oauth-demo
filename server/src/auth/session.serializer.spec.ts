import { Test, TestingModule } from '@nestjs/testing';
import { SessionSerializer } from './session.serializer';
import { AuthService, UserPayload } from './auth.service';

const mockUser: UserPayload = {
  id: 'user-789',
  name: 'Serializer User',
  email: 'serializer@example.com',
  provider: 'google',
};

describe('SessionSerializer', () => {
  let serializer: SessionSerializer;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionSerializer,
        {
          provide: AuthService,
          useValue: {
            findById: jest.fn((id: string) =>
              id === 'user-789' ? mockUser : undefined,
            ),
          },
        },
      ],
    }).compile();

    serializer = module.get<SessionSerializer>(SessionSerializer);
    authService = module.get<AuthService>(AuthService);
  });

  describe('serializeUser()', () => {
    it('should pass only the user id to done callback', () => {
      const done = jest.fn();
      serializer.serializeUser(mockUser, done);

      expect(done).toHaveBeenCalledWith(null, 'user-789');
    });
  });

  describe('deserializeUser()', () => {
    it('should call authService.findById and return the user', () => {
      const done = jest.fn();
      serializer.deserializeUser('user-789', done);

      expect(authService.findById).toHaveBeenCalledWith('user-789');
      expect(done).toHaveBeenCalledWith(null, mockUser);
    });

    it('should call done(null, null) for an unknown id', () => {
      const done = jest.fn();
      serializer.deserializeUser('nonexistent', done);

      expect(done).toHaveBeenCalledWith(null, null);
    });
  });
});
