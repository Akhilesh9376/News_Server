import { Router } from 'express';
import {
    getNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
    getNewsByCategory,
    getMyNews,
    incrementViews
} from '../controllers/newsController';
import auth from '../middleware/auth';

const router = Router();

// @route   GET api/news
// @desc    Get all news
// @access  Public
router.get('/', getNews);

// @route   GET api/news/category/:category
// @desc    Get news by category
// @access  Public
router.get('/category/:category', getNewsByCategory);

// @route   GET api/news/mine
// @desc    Get authored news for logged-in employee
// @access  Private
router.get('/mine', auth, getMyNews);

// @route   GET api/news/:id
// @desc    Get a single news article by ID
// @access  Public
router.get('/:id', getNewsById);

// @route   POST api/news/:id/view
// @desc    Increment views for an article
// @access  Public
router.post('/:id/view', incrementViews);

// @route   POST api/news
// @desc    Create a news article
// @access  Private
router.post('/', auth, createNews);

// @route   PUT api/news/:id
// @desc    Update a news article
// @access  Private
router.put('/:id', auth, updateNews);

// @route   DELETE api/news/:id
// @desc    Delete a news article
// @access  Private
router.delete('/:id', auth, deleteNews);

export default router;