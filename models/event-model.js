const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    description : { 
        type: String, 
        required: true 
    },
    date: { 
        type: Date, 
        required: true 
    },
    registrationFee: { 
        type: Number, 
        default: 0, 
        required: true 
    },
    venue: { 
        type: String, 
        required: true 
    },
    category: { 
        type: String, 
        required: true 
    },
    poster: { 
        type: String,
        default: "https://d12m9erqbesehq.cloudfront.net/wp-content/uploads/sites/2/2023/12/10195608/Blog-Banner-Fun-events-for-college-fest.jpg",
    },
    createdBy: { 
        type: Schema.Types.ObjectId, //Iska matlab hai ki is field mein jo data store hoga, woh ek MongoDB ObjectId hoga.
        ref: 'User', 
        required: true 
    }   
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;