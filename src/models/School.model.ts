import { Schema, model, Document } from 'mongoose';

export interface ISchool extends Document {
  name: string;
  schoolCode: string;
}

const SchoolSchema = new Schema<ISchool>({
  name: {
    type: String,
    required: true,
  },
  schoolCode: {
    type: String,
    required: true,
    unique: true,
  },
});

const School = model<ISchool>('School', SchoolSchema);

export default School;
