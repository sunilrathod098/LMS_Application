import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import { ApiError } from '../utils/apiError.js';

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
        enum: ['user', 'admin', 'instructor'],
        default: 'user'
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        }
    },
},
    {
        timestamps: true
    });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    if (!this.password || !password) {
        throw new ApiError('password or hashed password is missing', 400);
    }
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            name: this.name,
            email: this.email,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema);