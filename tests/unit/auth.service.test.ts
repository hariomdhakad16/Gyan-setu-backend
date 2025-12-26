import AuthService from '../../src/services/Auth.service';
import bcrypt from 'bcryptjs';
import School from '../../src/models/School.model';
import User from '../../src/models/User.model';
import AuditLog from '../../src/models/AuditLog.model';
import { RegisterBody } from '../../src/types/auth.types';

jest.mock('../../src/models/School.model');
jest.mock('../../src/models/User.model');
jest.mock('../../src/models/AuditLog.model');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'password123';
      const hashedPassword = await AuthService.hashPassword(password);
      
      expect(hashedPassword).not.toEqual(password);
      
      const isMatch = await bcrypt.compare(password, hashedPassword);
      expect(isMatch).toBe(true);
    });
  });

  describe('validateSchoolCode', () => {
    it('should return true for a valid school code', async () => {
      (School.findOne as jest.Mock).mockResolvedValue({ _id: 'schoolId' });
      const result = await AuthService.validateSchoolCode('VALIDCODE');
      expect(result).toBe(true);
    });

    it('should return false for an invalid school code', async () => {
      (School.findOne as jest.Mock).mockResolvedValue(null);
      const result = await AuthService.validateSchoolCode('INVALIDCODE');
      expect(result).toBe(false);
    });
  });

  describe('register', () => {
    const registerData: RegisterBody = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      schoolCode: 'VALIDCODE',
    };

    it('should register a new user successfully', async () => {
      jest.spyOn(AuthService, 'validateSchoolCode').mockResolvedValue(true);
      (User.findOne as jest.Mock).mockResolvedValue(null);
      jest.spyOn(AuthService, 'hashPassword').mockResolvedValue('hashedPassword');
      (School.findOne as jest.Mock).mockResolvedValue({ _id: 'schoolId' });
      const saveUserSpy = jest.spyOn(User.prototype, 'save').mockResolvedValue({} as any);
      const saveAuditLogSpy = jest.spyOn(AuditLog.prototype, 'save').mockResolvedValue({} as any);

      await AuthService.register(registerData);

      expect(saveUserSpy).toHaveBeenCalled();
      expect(saveAuditLogSpy).toHaveBeenCalled();
    });

    it('should throw an error for an invalid school code', async () => {
      jest.spyOn(AuthService, 'validateSchoolCode').mockResolvedValue(false);

      await expect(AuthService.register(registerData)).rejects.toThrow('Invalid school code');
    });

    it('should throw an error if the user already exists', async () => {
      jest.spyOn(AuthService, 'validateSchoolCode').mockResolvedValue(true);
      (User.findOne as jest.Mock).mockResolvedValue({ email: registerData.email });

      await expect(AuthService.register(registerData)).rejects.toThrow('User with this email already exists');
    });
  });
});
