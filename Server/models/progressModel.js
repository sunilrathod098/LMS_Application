import mongoose, { Schema } from "mongoose";

const progressSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    lessonsCompleted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    resourcesAccessed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource'
    }],
    lastAccessed: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

export const Progress = mongoose.model('Progress', progressSchema);