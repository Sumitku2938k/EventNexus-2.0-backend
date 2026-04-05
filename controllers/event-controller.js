const Event = require('../models/event-model');

const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        // console.log("All Events Data: ", events); // debug log removed to avoid cluttering the terminal

        if(!events || events.length === 0){
            return res.status(404).json({ message: 'No events found' });
        }

        return res.status(200).json({ events });
    } catch (error) {
        console.error('Error in fetching all events:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ event });
    } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { getAllEvents, getEventById };