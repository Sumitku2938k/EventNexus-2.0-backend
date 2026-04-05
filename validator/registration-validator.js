const { z } = require('zod');

// Validation schema for event registration
const registrationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name too long"),

    email: z
        .string()
        .email("Invalid email format")
        .trim()
        .toLowerCase(),

    phone: z
        .string()
        .trim()
        .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

    college: z
        .string()
        .trim()
        .min(3, "College name must be at least 3 characters")
        .max(100, "College name too long"),

    branch: z
        .string()
        .trim()
        .min(2, "Branch must be at least 2 characters")
        .max(50, "Branch name too long"),

    year: z
        .coerce.number()
        .int("Year must be an integer")
        .min(1, "Year must be between 1 and 4")
        .max(4, "Year must be between 1 and 4")
});

module.exports = { registrationSchema };
