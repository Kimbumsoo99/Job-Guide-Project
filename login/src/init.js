import "./db";
import "./models/User";
import app from "./server";

const PORT = process.env.PORT || 3500;

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
