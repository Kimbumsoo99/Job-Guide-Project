import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/temp");

const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB 🚀");
const handleError = (error) => console.log("❌ DB Error", error);

db.on("error", handleError); //error 이벤트 발생시 (on은 여러번 발생)
db.once("open", handleOpen); //connection이 열려서 DB에 연결 된 경우 (once는 한 번만 발생)
