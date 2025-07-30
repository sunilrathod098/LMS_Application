import mongoose, { Schema } from "mongoose";

const resourceSchema = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    fileUrl: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    }
}, {
    timestamps: true
});

export const Resource = mongoose.model('Resource', resourceSchema);