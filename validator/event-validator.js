const {z} = require('zod');

// Validation schema for event creation
const createEventSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Event name must be at least 3 characters")
        .max(50, "Event name too long"),

    description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description too long"),

    date: z
        .coerce.date() // Convert input to Date object
        .refine((d) => { 
            const now = new Date();
            return d.getTime() > now.getTime();  // Ensure the event date is in the future
        }, "Date must be in the future"),

    registrationFee: z
        .coerce.number()
        .min(0, "Registration fee cannot be negative")
        .optional(),

    venue: z
        .string()
        .trim()
        .min(3, "Venue name must be at least 3 characters")
        .max(50, "Venue name too long"),

    category: z
        .string()
        .trim()
        .min(3, "Category must be at least 3 characters")
        .max(30, "Category too long"),

    poster: z
        .string()
        .url() // Validate that the poster is a valid URL
        .optional()
});

const updateEventSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Event name must be at least 3 characters")
        .max(50, "Event name too long")
        .optional(),
    
    description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description too long")
        .optional(),

    date: z
        .coerce.date()
        .refine((d) => d > new Date(), "Date must be in the future")
        .optional(),
    
    registrationFee: z
        .coerce.number()
        .min(0, "Registration fee cannot be negative")
        .optional(),

    venue: z
        .string()
        .trim()
        .min(3, "Venue name must be at least 3 characters")
        .max(50, "Venue name too long")
        .optional(),
        
    category: z
        .string()
        .trim()
        .min(3, "Category must be at least 3 characters")
        .max(30, "Category too long")
        .optional(),

    poster: z
        .string()
        .url() // Validate that the poster is a valid URL
        .optional()
});

module.exports = { createEventSchema, updateEventSchema };