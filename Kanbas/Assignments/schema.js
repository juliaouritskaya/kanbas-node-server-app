import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        points: { type: Number, default: 100 },
        dueDate: { type: Date },
        availableFrom: { type: Date },
        availableUntil: { type: Date },
        course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel", required: true },
    },
    { collection: "assignments" }
);

export default schema;