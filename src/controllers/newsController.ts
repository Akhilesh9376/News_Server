import { Request, Response } from 'express';
import News from '../models/News';
import Employee from '../models/Employee';

// Extend Express Request type to include employee property
interface AuthRequest extends Request {
    employee?: { id: string };
}

// Get all news articles with pagination
export const getNews = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const news = await News.find()
            .sort({ publishedDate: -1 })
            .skip(skip)
            .limit(limit);
        
        const totalItems = await News.countDocuments();
        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            news,
            currentPage: page,
            totalPages,
            totalItems
        });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Get a single news article by ID
export const getNewsById = async (req: Request, res: Response) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json(news);
    } catch (err: any) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Get news by category with pagination
export const getNewsByCategory = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const category = req.params.category;

    try {
        const news = await News.find({ category })
            .sort({ publishedDate: -1 })
            .skip(skip)
            .limit(limit);

        const totalItems = await News.countDocuments({ category });
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
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Create a news article
export const createNews = async (req: AuthRequest, res: Response) => {
    try {
        const employee = await Employee.findById(req.employee?.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const {
            heading,
            subheading,
            content,
            category,
            imageUrl
        } = req.body;

        const newNews = new News({
            heading,
            subheading,
            content,
            category,
            employeeName: employee.name,
            imageUrl,
        });
        console.log(newNews);

        const news = await newNews.save();
        res.json(news);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Update a news article
export const updateNews = async (req: AuthRequest, res: Response) => {
    try {
        let news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        // For this example, we allow any authenticated employee to edit.
        // In a real-world scenario, you might want to check if the employee is the author.
        const employee = await Employee.findById(req.employee?.id);
        if (news.employeeName !== employee?.name) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const {
            heading,
            subheading,
            content,
            category,
            imageUrl
        } = req.body;

        const updatedFields: any = {};
        if (heading) updatedFields.heading = heading;
        if (subheading) updatedFields.subheading = subheading;
        if (content) updatedFields.content = content;
        if (category) updatedFields.category = category;
        if (imageUrl) updatedFields.imageUrl = imageUrl;
        updatedFields.publishedDate = Date.now(); // Update the date on edit

        news = await News.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true }
        );

        res.json(news);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Delete a news article
export const deleteNews = async (req: AuthRequest, res: Response) => {
    try {
        const news = await News.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found' });
        }

        // Ensure the request is authenticated and employee info is available
        if (!req.employee?.id) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Load the authenticated employee and compare ownership by name
        const employee = await Employee.findById(req.employee.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Compare by the stored employeeName on the news document
        if (news.employeeName !== employee.name) {
            return res.status(403).send('You are not allowed to delete this article');
        }

        await news.deleteOne(); // Using deleteOne() on the document

        res.json({ message: 'News removed' });
    } catch (err: any) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(500).send('Server Error');
    }
};

// Get news authored by the logged-in employee with pagination and optional filters
export const getMyNews = async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || '';
    const category = (req.query.category as string) || '';

    try {
        const employee = await Employee.findById(req.employee?.id).select('-password');
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const baseFilter: any = { employeeName: employee.name };
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

        const news = await News.find(finalFilter)
            .sort({ publishedDate: -1 })
            .skip(skip)
            .limit(limit);

        const totalItems = await News.countDocuments(finalFilter);
        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            news,
            currentPage: page,
            totalPages,
            totalItems,
        });
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Increment views for a news article
export const incrementViews = async (req: Request, res: Response) => {
    try {
        const updated = await News.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ message: 'News not found' });
        }
        res.json({ views: updated.views });
    } catch (err: any) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'News not found' });
        }
        res.status(500).send('Server Error');
    }
};