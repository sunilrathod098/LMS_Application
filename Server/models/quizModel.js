import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true,
                },
                options: [
                    {
                        type: String,
                        required: true,
                    },
                ],
                correctAnswer: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Quiz = mongoose.model("Quiz", quizSchema);
