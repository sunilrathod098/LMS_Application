import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);