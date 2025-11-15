import { Schema, model, Document } from 'mongoose';

export interface INews extends Document {
    heading: string;
    subheading: string;
    content: string;
    category: 'Technology' | 'Sports' | 'Politics' | 'Environment' | 'Business' | 'Entertainment' | 'Health' | 'Others';
    employeeName: string;
    publishedDate: Date;
    imageUrl?: string;
    views?: number;
}

const NewsSchema = new Schema({
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['Technology', 'Sports', 'Politics','Environment', 'Business', 'Entertainment','Health','Others'], required: true },
    employeeName: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
    imageUrl: { type: String },
    views: { type: Number, default: 0 },
});

export default model<INews>('News', NewsSchema);