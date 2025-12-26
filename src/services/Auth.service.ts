import bcrypt from 'bcryptjs';
import School from '../models/School.model';

class AuthService {
  /**
   * Hashes a password using bcrypt.
   * @param password The password to hash.
   * @returns A promise that resolves to the hashed password.
   */
  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Validates a school code.
   * @param schoolCode The school code to validate.
   * @returns A promise that resolves to true if the school code is valid, false otherwise.
   */
  public async validateSchoolCode(schoolCode: string): Promise<boolean> {
    const school = await School.findOne({ schoolCode });
    return !!school;
  }
}

export default new AuthService();
