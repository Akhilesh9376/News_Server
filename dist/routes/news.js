"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsController_1 = require("../controllers/newsController");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = (0, express_1.Router)();
// @route   GET api/news
// @desc    Get all news
// @access  Public
router.get('/', newsController_1.getNews);
// @route   GET api/news/category/:category
// @desc    Get news by category
// @access  Public
router.get('/category/:category', newsController_1.getNewsByCategory);
// @route   GET api/news/mine
// @desc    Get authored news for logged-in employee
// @access  Private
router.get('/mine', auth_1.default, newsController_1.getMyNews);
// @route   GET api/news/:id
// @desc    Get a single news article by ID
// @access  Public
router.get('/:id', newsController_1.getNewsById);
// @route   POST api/news/:id/view
// @desc    Increment views for an article
// @access  Public
router.post('/:id/view', newsController_1.incrementViews);
// @route   POST api/news
// @desc    Create a news article
// @access  Private
router.post('/', auth_1.default, newsController_1.createNews);
// @route   PUT api/news/:id
// @desc    Update a news article
// @access  Private
router.put('/:id', auth_1.default, newsController_1.updateNews);
// @route   DELETE api/news/:id
// @desc    Delete a news article
// @access  Private
router.delete('/:id', auth_1.default, newsController_1.deleteNews);
exports.default = router;
