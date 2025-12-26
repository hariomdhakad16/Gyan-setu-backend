import AuthService from '../../src/services/Auth.service';
import bcrypt from 'bcryptjs';
import School from '../../src/models/School.model';

describe('AuthService', () => {
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
      const findOneSpy = jest.spyOn(School, 'findOne').mockResolvedValue({} as any);
      const result = await AuthService.validateSchoolCode('VALIDCODE');
      expect(result).toBe(true);
      findOneSpy.mockRestore();
    });

    it('should return false for an invalid school code', async () => {
      const findOneSpy = jest.spyOn(School, 'findOne').mockResolvedValue(null);
      const result = await AuthService.validateSchoolCode('INVALIDCODE');
      expect(result).toBe(false);
      findOneSpy.mockRestore();
    });
  });

  describe('register', () => {
    it.todo('should register a new user');
  });
});
