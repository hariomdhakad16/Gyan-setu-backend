import bcrypt from 'bcryptjs';
import School from '../models/School.model';
import User from '../models/User.model';
import AuditLog from '../models/AuditLog.model';
import { RegisterBody } from '../types/auth.types';

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

  /**
   * Registers a new user.
   * @param data The registration data.
   * @returns The newly created user.
   */
  public async register(data: RegisterBody) {
    const { email, password, firstName, lastName, schoolCode } = data;

    const isSchoolCodeValid = await this.validateSchoolCode(schoolCode);
    if (!isSchoolCodeValid) {
      throw new Error('Invalid school code');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    
    const school = await School.findOne({ schoolCode });

    const newUser = new User({
      email,
      password: hashedPassword,
      profile: {
        firstName,
        lastName,
      },
      studentInfo: {
        schoolId: school?._id,
      }
    });

    await newUser.save();

    const auditLog = new AuditLog({
      userId: newUser._id,
      action: 'REGISTER',
    });
    await auditLog.save();

    return newUser;
  }
}

export default new AuthService();
