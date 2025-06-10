const express = require("express");
const app = express();
const database = require("./Config/database");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const dotenv = require("dotenv");

const userRoutes = require("./Routes/UserRoutes")
const propRoutes = require("./Routes/PropertyRoutes")
const searRoutes = require("./Routes/SearchRoutes")

dotenv.config();
const PORT = process.env.PORT;

database.connect();
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/prop", propRoutes);
app.use("/api/v1/sear", searRoutes);


app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: 'Your server is up and running....'
    });
});

app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`)
})
