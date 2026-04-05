const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const { signUpSchema, loginSchema } = require('../validator/auth-validator');
const validate = require('../middlewares/validate-middleware');

router.route('/').get(authController.home); //Route for home page
router.route('/register').post(validate(signUpSchema), authController.register); // Route for user registration
router.route('/login').post(validate(loginSchema), authController.login); // Route for user login

// Route to fetch currently authenticated user
const authMiddleware = require('../middlewares/auth-middleware');
router.route('/user').get(authMiddleware, authController.getUser); // protected route returning user info

module.exports = router;