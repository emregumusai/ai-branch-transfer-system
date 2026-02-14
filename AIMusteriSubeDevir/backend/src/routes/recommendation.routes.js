// Branch Recommendation Routes
// Şube öneri route'ları
// Branch recommendation routes

const express = require('express');
const router = express.Router();
const branchRecommendationController = require('../controllers/branch-recommendation.controller');
const branchRecommendationValidator = require('../validators/branch-recommendation.validator');

/**
 * POST /api/recommendations
 * AI tabanlı şube önerisi alır
 * Gets AI-based branch recommendation
 * 
 * Request Body:
 * {
 *   "il": "İstanbul",
 *   "konum": "Kadıköy Şubesi",
 *   "secimler": ["Park Yeri Mevcut", "Şube Yoğunluğu Düşük"]
 * }
 * 
 * Response:
 * {
 *   "oneri": "Üsküdar Şubesi",
 *   "aciklama": "Park yeri ve düşük yoğunluk mevcut...",
 *   "enYakin": "Kartal Şubesi"
 * }
 */
router.post(
    '/',
    branchRecommendationValidator.sanitize.bind(branchRecommendationValidator),
    branchRecommendationValidator.validate.bind(branchRecommendationValidator),
    branchRecommendationController.getRecommendation.bind(branchRecommendationController)
);

module.exports = router;
