const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event-controller');
const registrationController = require('../controllers/registration-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const validate = require('../middlewares/validate-middleware');
const { registrationSchema } = require('../validator/registration-validator');

//Route for all events page
router.route('/').get(authMiddleware, eventController.getAllEvents);
router.route('/:id').get(authMiddleware, eventController.getEventById); //Route for getting event details by ID

// Registration route for students
router.route('/:eventId/register').post(
    authMiddleware, 
    validate(registrationSchema), 
    registrationController.registerForEvent
);

module.exports = router;