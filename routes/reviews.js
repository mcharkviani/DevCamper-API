const express = require('express');
// must pass {mergeParams: true} to the child router if you want to access the params from the parent router.
const router = express.Router({ mergeParams: true });

const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews');

const Review = require('../models/Review');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )
  .post(protect, authorize('user', 'publisher'), addReview);

// authorize('user', 'admin'), addReview) in Reality, but in postman it's easer for me publisher because I use email with publisher role for other case;

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('publisher'), updateReview)
  .delete(protect, authorize('publisher'), deleteReview);

module.exports = router;
