import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'student' | 'teacher' | 'admin';
  profile: {
    firstName: string;
    lastName: string;
    language: 'pa' | 'hi' | 'en';
  };
  studentInfo?: {
    schoolId: Schema.Types.ObjectId;
    class: number;
    section: string;
  };
  refreshToken?: string;
  loginAttempts: number;
  lockUntil?: Date;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
    select: false, // Do not return password by default
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  profile: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ['pa', 'hi', 'en'],
      default: 'pa',
    },
  },
  studentInfo: {
    schoolId: {
      type: Schema.Types.ObjectId,
      ref: 'School',
    },
    class: {
      type: Number,
    },
    section: {
      type: String,
    },
  },
  refreshToken: {
    type: String,
    select: false,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
  lastLogin: {
    type: Date,
  },
}, { timestamps: true });

const User = model<IUser>('User', UserSchema);

export default User;
