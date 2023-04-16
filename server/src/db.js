import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/testlogin"); // 뒤에 testlogin 붙이면 DB 생성
const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("DB Error", error);

//on은 여러번 계속 발생시킬 수 있지만 once는 한 번만 발생
db.on("error", handleError);
db.once("open", handleOpen);
