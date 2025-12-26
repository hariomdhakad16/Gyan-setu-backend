import { Schema, model, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userId?: Schema.Types.ObjectId;
  action: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'REGISTER' | 'LOCKOUT' | 'REFRESH';
  details?: Record<string, any>;
  ip?: string;
  userAgent?: string;
}

const AuditLogSchema = new Schema<IAuditLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    enum: ['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'REGISTER', 'LOCKOUT', 'REFRESH'],
    required: true,
  },
  details: {
    type: Schema.Types.Mixed,
  },
  ip: {
    type: String,
  },
  userAgent: {
    type: String,
  },
}, { timestamps: true });

const AuditLog = model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
