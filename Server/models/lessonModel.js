import mongoose, { Schema } from "mongoose";

const lessonSchema = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
    }
}, {
    timestamps: true
});

export const Lesson = mongoose.model('Lesson', lessonSchema);