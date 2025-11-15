"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NewsSchema = new mongoose_1.Schema({
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['Technology', 'Sports', 'Politics', 'Environment', 'Business', 'Entertainment', 'Health', 'Others'], required: true },
    employeeName: { type: String, required: true },
    publishedDate: { type: Date, default: Date.now },
    imageUrl: { type: String },
    views: { type: Number, default: 0 },
});
exports.default = (0, mongoose_1.model)('News', NewsSchema);
