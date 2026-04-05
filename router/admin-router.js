const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin-controller');
const registrationController = require('../controllers/registration-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const adminMiddleware = require('../middlewares/admin-middleware');
const { createEventSchema, updateEventSchema } = require('../validator/event-validator');
const validate = require('../middlewares/validate-middleware');

// Event management routes
router.route('/events/create').post(authMiddleware, adminMiddleware, validate(createEventSchema), adminController.createEvent); //Route for creating events
router.route('/events/delete/:id').delete(authMiddleware, adminMiddleware, adminController.deleteEvent); //Route for deleting events
router.route('/events/update/:id').patch(authMiddleware, adminMiddleware, validate(updateEventSchema), adminController.updateEvent); //Route for updating events

// Registration management routes (Admin only)
router.route('/events/:eventId/registrations').get(
    authMiddleware, 
    adminMiddleware, 
    registrationController.getEventRegistrations
); //Get all registrations for a specific event

router.route('/registrations/:registrationId').get(
    authMiddleware, 
    adminMiddleware, 
    registrationController.getRegistrationById
); //Get single student registration details

module.exports = router;