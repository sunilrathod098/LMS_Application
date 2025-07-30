import mongoose, { Schema } from 'mongoose';

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        min: 0
    },
    thumbnail: {
        type: String,
    },
}, {
    timestamps: true
});

export const Course = mongoose.model('Course', courseSchema);