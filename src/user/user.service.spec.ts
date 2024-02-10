import { Model } from 'mongoose';
import { User } from './schemas/user.schemas';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MailService } from 'src/mail/mail.service';
import { UserRole } from './role/enum/user-role.enum';

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: {
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendVerification: jest.fn(),
            sendResetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const expectedUsers: User[] = [
        {
          _id: '1',
          firstname: 'John',
          lastname: 'Doe',
          phone: '123456789',
          profileImage: 'path/to/image1.jpg',
          resetPasswordToken: 'resetToken1',
          resetPasswordExpires: new Date('2023-01-01'),
          email: 'john@example.com',
          isEmailVerified: true,
          emailVerificationToken: 'verificationToken1',
          password: 'hashedPassword1',
          role: UserRole.LANDLORD,
          created_at: new Date('2023-01-01'),
          updated_at: new Date('2023-01-01'),
        },
        {
          _id: '2',
          firstname: 'Jane',
          lastname: 'Doe',
          phone: '987654321',
          profileImage: 'path/to/image2.jpg',
          resetPasswordToken: 'resetToken2',
          resetPasswordExpires: new Date('2023-01-02'),
          email: 'jane@example.com',
          isEmailVerified: false,
          emailVerificationToken: 'verificationToken2',
          password: 'hashedPassword2',
          role: UserRole.TENANT,
          created_at: new Date('2023-01-02'),
          updated_at: new Date('2023-01-02'),
        },
      ];

      // Mock the `find` method to return the expected users
      jest.spyOn(userModel, 'find').mockReturnValueOnce({
        select: jest.fn().mockReturnValueOnce({
          exec: jest.fn().mockResolvedValueOnce(expectedUsers),
        }),
      } as any);

      const result = await service.findAll();
      expect(result).toEqual(expectedUsers);
    });
  });
});
