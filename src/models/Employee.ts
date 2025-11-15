import { Schema, model, Document } from 'mongoose';

export interface IEmployee extends Document {
    name: string;
    email: string;
    password: string;
}

const EmployeeSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default model<IEmployee>('Employee', EmployeeSchema);