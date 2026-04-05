const Event = require('../models/event-model');
const cloudinary = require('cloudinary').v2;

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});

const createEvent = async (req, res) => {
    try {
        const { name, description, date, venue, registrationFee, category } = req.body;

        // basic validation
        if (!name || !description || !date || !venue || !category) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let posterUrl = "";

        // file check and upload to Cloudinary
        if (req.files && req.files.poster) {
            const file = req.files.poster;
            const result = await cloudinary.uploader.upload(file.tempFilePath); // upload using await (NO callback)
            posterUrl = result.secure_url;
        }

        const event = new Event({
            name,
            description,
            date,
            venue,
            registrationFee,
            category,
            poster: posterUrl,
            createdBy: req.user._id // secure
        });
        await event.save(); // Save the event to the database
        res.status(201).json({ message: 'Event created successfully', event});
        console.log("Event created: ", event);
    } catch (error) {
        console.error('Error in events controller:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id); // 1. Find event

        if (!event) {  // 2. Event Not found
            return res.status(404).json({ message: 'Event not found' });
        }

        if (req.user.role !== 'admin') {  // 3. Ownership check
            return res.status(403).json({ message: 'Unauthorized to delete this event' });
        }

        await Event.findByIdAndDelete(id); // 4. Delete event

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, date, venue, registrationFee, category } = req.body; 
        const event = await Event.findById(id); // 1. Find event
        
        if (!event) { // 2. Event Not found
            return res.status(404).json({ message: 'Event not found' });
        }
        
        if (req.user.role !== 'admin') {  // 3. Ownership check
            return res.status(403).json({ message: 'Unauthorized to update this event' });
        }

        let posterUrl = "";

        // file check and upload to Cloudinary
        if (req.files && req.files.poster) {
            const file = req.files.poster;
            const result = await cloudinary.uploader.upload(file.tempFilePath); // upload using await (NO callback)
            posterUrl = result.secure_url;
        }
        
        const updatedEvent = await Event.findByIdAndUpdate(id, { name, description, date, venue, registrationFee, category, poster: posterUrl }, { new: true });
        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { createEvent, deleteEvent, updateEvent };
