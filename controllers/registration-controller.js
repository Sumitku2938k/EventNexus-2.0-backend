const Registration = require('../models/registration-model');
const Event = require('../models/event-model');

// POST /api/events/:eventId/register
// Register a student for an event
const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { name, email, phone, college, branch, year } = req.body;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check for duplicate registration
        const existingRegistration = await Registration.findOne({
            userId: req.user._id,
            eventId: eventId
        });

        if (existingRegistration) {
            return res.status(400).json({ 
                message: 'You have already registered for this event' 
            });
        }

        // Create new registration
        const registration = new Registration({
            userId: req.user._id,
            eventId: eventId,
            name,
            email,
            phone,
            college,
            branch,
            year
        });

        await registration.save();

        res.status(201).json({ 
            message: 'Successfully registered for the event',
            registration 
        });

        console.log("New registration created:", registration);
    } catch (error) {
        console.error('Error in registering for event:', error);
        
        // Handle duplicate registration error from unique index
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'You have already registered for this event' 
            });
        }
        
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// GET /api/admin/events/:eventId/registrations
// Get all registrations for a specific event (Admin only)
const getEventRegistrations = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Check if event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Get all registrations for this event
        const registrations = await Registration.find({ eventId: eventId })
            .populate('userId', 'name email role')
            .populate('eventId', 'name date venue')
            .sort({ registeredAt: -1 }); // Sort by latest registration first

        if (!registrations || registrations.length === 0) {
            return res.status(404).json({ 
                message: 'No registrations found for this event' 
            });
        }

        res.status(200).json({ 
            message: `Found ${registrations.length} registrations`,
            count: registrations.length,
            registrations 
        });
    } catch (error) {
        console.error('Error fetching event registrations:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// GET /api/admin/registrations/:registrationId
// Get single registration details (Admin only)
const getRegistrationById = async (req, res) => {
    try {
        const { registrationId } = req.params;

        const registration = await Registration.findById(registrationId)
            .populate('userId', 'name email role')
            .populate('eventId', 'name description date venue registrationFee category');

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        res.status(200).json({ registration });
    } catch (error) {
        console.error('Error fetching registration by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { 
    registerForEvent, 
    getEventRegistrations, 
    getRegistrationById 
};
