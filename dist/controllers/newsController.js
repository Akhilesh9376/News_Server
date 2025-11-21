"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementViews = exports.getMyNews = exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsByCategory = exports.getNewsById = exports.getNews = void 0;
const News_1 = __importDefault(require("../models/News"));
const Employee_1 = __importDefault(require("../models/Employee"));
// Get all news articles with pagination
const getNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const news = yield News_1.default.find()
            .sort({ publishedDate: -1 })
            .skip(skip)
            .limit(limit);
        const totalItems = yield News_1.default.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);
        res.json({
            news,
            currentPage: page,
            totalPages,
            totalItems
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
exports.getNews = getNews;
// Get a single news article by ID
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield News_1.default.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(news);
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(500).send('Server Error');
    }
});
exports.getNewsById = getNewsById;
// Get news by category with pagination
const getNewsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.params.category;
    try {
        const news = yield News_1.default.find({ category })
            .sort({ publishedDate: -1 })
            .skip(skip)
            .limit(limit);
        const totalItems = yield News_1.default.countDocuments({ category });
        const totalPages = Math.ceil(totalItems / limit);
        if (totalItems === 0) {
            return res.status(404).json({ message: 'No news found in this category' });
        }
        res.json({
            news,
            currentPage: page,
            totalPages,
            totalItems
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
exports.getNewsByCategory = getNewsByCategory;
// Create a news article
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const employee = yield Employee_1.default.findById((_a = req.employee) === null || _a === void 0 ? void 0 : _a.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const { heading, subheading, content, category, imageUrl } = req.body;
        const newNews = new News_1.default({
            heading,
            subheading,
            content,
            category,
            employeeName: employee.name,
            imageUrl,
        });
        console.log(newNews);
        const news = yield newNews.save();
        res.json(news);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
exports.createNews = createNews;
// Update a news article
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let news = yield News_1.default.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        // For this example, we allow any authenticated employee to edit.
        // In a real-world scenario, you might want to check if the employee is the author.
        const employee = yield Employee_1.default.findById((_a = req.employee) === null || _a === void 0 ? void 0 : _a.id);
        if (news.employeeName !== (employee === null || employee === void 0 ? void 0 : employee.name)) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        const { heading, subheading, content, category, imageUrl } = req.body;
        const updatedFields = {};
        if (heading)
            updatedFields.heading = heading;
        if (subheading)
            updatedFields.subheading = subheading;
        if (content)
            updatedFields.content = content;
        if (category)
            updatedFields.category = category;
        if (imageUrl)
            updatedFields.imageUrl = imageUrl;
        updatedFields.publishedDate = Date.now(); // Update the date on edit
        news = yield News_1.default.findByIdAndUpdate(req.params.id, { $set: updatedFields }, { new: true });
        res.json(news);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
exports.updateNews = updateNews;
// Delete a news article
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const news = yield News_1.default.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        // Ensure the request is authenticated and employee info is available
        if (!((_a = req.employee) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        // Load the authenticated employee and compare ownership by name
        const employee = yield Employee_1.default.findById(req.employee.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // Compare by the stored employeeName on the news document
        if (news.employeeName !== employee.name) {
            return res.status(403).send('You are not allowed to delete this article');
        }
        yield news.deleteOne(); // Using deleteOne() on the document
        res.json({ message: 'News removed' });
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(500).send('Server Error');
    }
});
exports.deleteNews = deleteNews;
// Get news authored by the logged-in employee with pagination and optional filters
const getMyNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';
    try {
        const employee = yield Employee_1.default.findById((_a = req.employee) === null || _a === void 0 ? void 0 : _a.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        const baseFilter = { employeeName: employee.name };
        if (category) {
            baseFilter.category = category;
        }
        const searchFilter = search
            ? {
                $or: [
                    { heading: { $regex: search, $options: 'i' } },
                    { subheading: { $regex: search, $options: 'i' } },
                    { content: { $regex: search, $options: 'i' } },
                ],
            }
            : {};
        const finalFilter = Object.keys(searchFilter).length
            ? { $and: [baseFilter, searchFilter] }
            : baseFilter;
        const news = yield News_1.default.find(finalFilter)
            .sort({ publishedDate: -1 })
            .skip(skip)
            .limit(limit);
        const totalItems = yield News_1.default.countDocuments(finalFilter);
        const totalPages = Math.ceil(totalItems / limit);
        res.json({
            news,
            currentPage: page,
            totalPages,
            totalItems,
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
exports.getMyNews = getMyNews;
// Increment views for a news article
const incrementViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield News_1.default.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json({ views: updated.views });
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(500).send('Server Error');
    }
});
exports.incrementViews = incrementViews;
