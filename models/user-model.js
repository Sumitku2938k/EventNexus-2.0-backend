const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    role: { 
        type: String, 
        enum: ['student', 'admin'], 
        default: 'student',
        required: true
    }
});

//Secure password hashing before saving user to database
userSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) { //To check if user is old or new, if old then skip hashing
        console.log("Password not modified");
        next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt); //Hash the password and save it to user object
        next();
    } catch (error) {
        console.log("Error in hashing password", error);
        next(error);
    }
});
    
//JSON Web Token ( userSchema.methods se kitne bhi functions create kar sakte hai and usse controllers mein use kar sakte hai )
userSchema.methods.generateToken = async function (){  
    try{
        return jwt.sign({ //JWT payload mein user ki id, email aur role store karenge taki future mein authentication ke time pe use kar sake
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.role === 'admin',
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "7d",
        }
        );
    }catch(error){
        console.log("Error in generating token: ",error);
    }
}

const User = mongoose.model('User', userSchema);

module.exports = User;