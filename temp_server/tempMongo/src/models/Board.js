import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  writer: String,
  title: { type: String, trim: true, required: true },
  content: { type: String, trim: true, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  comments: [],
  meta: {
    views: { type: Number, default: 0, required: true },
  },
});

const Board = mongoose.model("Board", boardSchema);
export default Board;
