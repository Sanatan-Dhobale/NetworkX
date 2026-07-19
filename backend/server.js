import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"));

const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB Connected");

        app.listen(PORT, () => {
            console.log(`✅ Server listening on port ${PORT}`);
        });

    } catch (err) {
        console.error("❌ Startup Error:");
        console.error(err);
        process.exit(1);
    }
};

console.log("MONGO_URL exists:", !!process.env.MONGO_URL);
console.log("PORT:", process.env.PORT);

start();